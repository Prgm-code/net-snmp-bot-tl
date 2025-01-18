/**********************************************************************
 * main.js (o el nombre que prefieras)
 **********************************************************************/
const snmp = require('net-snmp');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const trapProcessing = require('./src/trapProcessing');
const bot = new Telegraf(process.env.ENV_TELEGRAM_BOT);

/**********************************************************************
 * Ajustes y banderas de estado
 **********************************************************************/
let trapServStatus = false;  // Para saber si ya estamos escuchando traps
let showTrap = false;        // Por defecto, no mostramos todo el JSON
let showHeartbeat = false;   // Por defecto, no mostramos el heartbeat

/**********************************************************************
 * Máquina de estados para Power Limit
 * (INACTIVE, ACTIVE, PENDING_CANCEL)
 **********************************************************************/
const STATE_INACTIVE = 'INACTIVE';
const STATE_ACTIVE = 'ACTIVE';
const STATE_PENDING_CANCEL = 'PENDING_CANCEL';

/**********************************************************************
 * Variables para gestionar alarmas de Power Limit
 **********************************************************************/
const powerLimitState = {};   // Estado actual (por OID): "INACTIVE" | "ACTIVE" | "PENDING_CANCEL"
const powerLimitTimers = {};  // Temporizadores de 2 minutos (por OID)

/**********************************************************************
 * Función auxiliar para enviar mensajes por Telegram
 **********************************************************************/
async function sendMessage(text, ctx) {
  try {
    await bot.telegram.sendMessage(ctx.chat.id, text);
  } catch (e) {
    console.log(e);
  }
}

/**********************************************************************
 * Función que identifica si el OID es de Power Limit
 **********************************************************************/
function isPowerLimitOid(oid) {
  return [
    '1.3.6.1.4.1.26061.10.8.1.18',
    '1.3.6.1.4.1.26061.10.8.2.18',
    '1.3.6.1.4.1.26061.10.8.3.18'
  ].includes(oid);
}

/**********************************************************************
 * Manejo específico de alarmas de Power Limit (máquina de estados)
 **********************************************************************/
function handlePowerLimitTrap(oid, value, ctx) {
  const oidTextMap = {
    '1.3.6.1.4.1.26061.10.8.1.18': 'Rec1: Power Limit',
    '1.3.6.1.4.1.26061.10.8.2.18': 'Rec2: Power Limit',
    '1.3.6.1.4.1.26061.10.8.3.18': 'Rec3: Power Limit',
  };

  const rectifier = oidTextMap[oid];
  if (!rectifier) return;

  // Si no existía estado previo, asumimos INACTIVE
  const currentState = powerLimitState[oid] || STATE_INACTIVE;

  console.log(
    `PowerLimitTrap => OID: ${oid}, value: ${value}, currentState: ${currentState}`
  );

  if (value === 1) {
    // Llega un "1"
    switch (currentState) {
      case STATE_INACTIVE:
        // Pasamos a "ACTIVE" y enviamos "START"
        powerLimitState[oid] = STATE_ACTIVE;
        console.log(`(DEBUG) -> START ALARM: ${rectifier}`);
        sendMessage(`Alarm STARTED for ${rectifier}`, ctx);
        break;

      case STATE_ACTIVE:
        // Ya estaba activo => no hacemos nada
        console.log(`(DEBUG) Alarma ya estaba ACTIVE, no se envía START`);
        break;

      case STATE_PENDING_CANCEL:
        // Cancelamos el temporizador de cancelación y volvemos a ACTIVE
        if (powerLimitTimers[oid]) {
          clearTimeout(powerLimitTimers[oid]);
          powerLimitTimers[oid] = null;
        }
        powerLimitState[oid] = STATE_ACTIVE;
        console.log(
          `(DEBUG) Recibimos 1 estando PENDING_CANCEL => volvemos a ACTIVE sin nuevo START`
        );
        break;
    }
  } else if (value === 0) {
    // Llega un "0"
    switch (currentState) {
      case STATE_INACTIVE:
        // Ya está inactiva => no hacemos nada
        console.log(`(DEBUG) Alarma ya estaba INACTIVE, no se envía CANCEL`);
        break;

      case STATE_ACTIVE:
        // Empezamos el conteo de 2 minutos para CANCELAR
        powerLimitState[oid] = STATE_PENDING_CANCEL;
        console.log(`(DEBUG) -> START CANCEL TIMER: ${rectifier}`);
        if (powerLimitTimers[oid]) {
          clearTimeout(powerLimitTimers[oid]);
        }
        // Programamos cancelación en 2 minutos
        powerLimitTimers[oid] = setTimeout(() => {
          powerLimitState[oid] = STATE_INACTIVE;
          powerLimitTimers[oid] = null;
          console.log(`(DEBUG) -> CANCEL CONFIRMED for ${rectifier}`);
          sendMessage(
            `Alarm CANCELLED for ${rectifier} after 2 minutes of inactivity`,
            ctx
          );
        }, 2 * 60 * 1000);
        break;

      case STATE_PENDING_CANCEL:
        // Ya estaba pendiente => reiniciamos el temporizador
        console.log(`(DEBUG) PENDING_CANCEL -> Se reinicia contador de 2 min`);
        if (powerLimitTimers[oid]) {
          clearTimeout(powerLimitTimers[oid]);
        }
        powerLimitTimers[oid] = setTimeout(() => {
          powerLimitState[oid] = STATE_INACTIVE;
          powerLimitTimers[oid] = null;
          console.log(`(DEBUG) -> CANCEL CONFIRMED for ${rectifier}`);
          sendMessage(
            `Alarm CANCELLED for ${rectifier} after 2 minutes of inactivity`,
            ctx
          );
        }, 2 * 60 * 1000);
        break;
    }
  }
}

/**********************************************************************
 * Función principal: creación del receptor SNMP
 **********************************************************************/
function snmpTrap(ctx) {
  const options = {
    port: 1161,
    disableAuthorization: true,
    includeAuthentication: false,
    accessControlModelType: snmp.AccessControlModelType.None,
    engineID: "8000B98380XXXXXXXXXXXXXXXXXXXXXXXX", // Reemplázalo con hex aleatorio
    address: null, // null => recibir en todas las interfaces
    transport: "udp4"
  };

  // Notificamos por Telegram que estamos escuchando
  sendMessage(
    `Listening on: ${options.address || 'all interfaces'}:${options.port} ${options.transport}`,
    ctx
  );

  // Callback que se invoca al recibir un trap
  const callback = (error, notification) => {
    if (error) {
      console.log('---Error received---');
      console.error(error);
      sendMessage(error.toString(), ctx);
      return;
    }

    console.log('---Received SNMP Trap---');

    // Extraemos OID y valor
    const oid = notification.pdu.varbinds[0].oid;
    const value = notification.pdu.varbinds[0].value;

    // Si es un OID de Power Limit, usamos handlePowerLimitTrap y NO llamamos a trapProcessing
    if (isPowerLimitOid(oid)) {
      handlePowerLimitTrap(oid, value, ctx);
    } else {
      // Para otros OIDs, usamos la lógica normal de trapProcessing
      const trapResult = trapProcessing(notification, showHeartbeat);
      // Si trapProcessing devolvió algo, lo mandamos por Telegram
      if (trapResult) {
        sendMessage(trapResult, ctx);
      }
    }

    // Opción para mostrar el JSON completo de la trampa, si está habilitado
    if (showTrap) {
      sendMessage(JSON.stringify(notification, null, 2), ctx);
    }
  };

  // Crear el receptor SNMP con las opciones definidas
  snmp.createReceiver(options, callback);
}

/**********************************************************************
 * Configuración del Bot de Telegram
 **********************************************************************/
bot.start((ctx) => {
  console.log(ctx.from);
  console.log(ctx.chat);
  console.log(ctx.message);
  console.log(ctx.updateSubTypes);
  ctx.reply('Welcome ' + ctx.from.first_name);
});

bot.command(['alarmas', 'Alarmas'], (ctx) => {
  if (trapServStatus) {
    ctx.reply('Already listening to traps');
  } else {
    trapServStatus = true;
    snmpTrap(ctx);
  }
});

bot.command(['showhb', 'SHOWHB'], (ctx) => {
  showHeartbeat = true;
  ctx.reply('Show heartbeat: ON');
});

bot.command(['noshowhb', 'NOSHOWHB'], (ctx) => {
  showHeartbeat = false;
  ctx.reply('Show heartbeat: OFF');
});

bot.command(['showtrap', 'SHOWTRAP'], (ctx) => {
  showTrap = true;
  ctx.reply('Show Trap Received: ON');
});

bot.command(['noshowtrap', 'NOSHOWTRAP'], (ctx) => {
  showTrap = false;
  ctx.reply('Show Trap Received: OFF');
});

/**********************************************************************
 * Inicio del Bot
 **********************************************************************/
console.log('SNMP Telegram Bot: STARTED');
bot.launch();

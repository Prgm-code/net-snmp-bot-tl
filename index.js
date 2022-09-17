const snmp = require('net-snmp');
const { Telegraf } = require('telegraf')
const trapProcessing = require ('./trapProcessing')
const bot = new Telegraf('5687778700:AAH0gQjZsUjXFD60L8aI3UT8Kew_gsv2Ajg')

// settings
let upTime = 0;
let trapServStatus = false; 
let showTrap = false // by defect the traps are not showed
let showHeartbeat = false; // by defect heartbeat is off 

let sendMessage = function(text,ctx) {
    try {
        let buffer = [];
        
        bot.telegram.sendMessage(ctx.chat.id ,text)
    } 
    catch(e) 
    {
        console.error(e);
    }
};

 function snmpTrap (ctx) {
    var options = {
        port: 162,
        disableAuthorization: true,
        includeAuthentication: false,
        accessControlModelType: snmp.AccessControlModelType.None,
        engineID: "8000B98380XXXXXXXXXXXXXXXXXXXXXXXX", // where the X's are random hex digits
        address: null, // null - recive on all eth ports 
        transport: "udp4"
    };

    sendMessage(`Listen on: ${options.addr}: ${options.port} ${options.transport} `,ctx);
    
    let callback = function (error, notification) {
        if ( error ) {
            console.log('---error recived ---')
            console.error (error);
            sendMessage(error,ctx)
    
        } else {
            console.log('---Recived SNMP Trap---')
            //console.log (JSON.stringify(notification, null, 2));
            let trapResult = trapProcessing(notification);
            if (trapResult) sendMessage(trapResult,ctx);        
        }

    };
    
  snmp.createReceiver (options, callback);

   
}



bot.start((ctx)=>{
    
    console.log(ctx.from);
    console.log(ctx.chat);
    console.log(ctx.message);
    console.log(ctx.updateSubTypes);

    ctx.reply('welcome '+ ctx.from.first_name);


});
bot.command(['alarmas','Alarmas'],  (ctx) =>{
    if (trapServStatus){
        ctx.reply('Already Listening Traps')
    }else{
        trapServStatus = true;
        snmpTrap(ctx);
    }
});

/* function trapProcessing (notification,ctx) {
    let agentAddr = notification.pdu.agentAddr;
    let oid = notification.pdu.varbinds[0].oid;
    let value =notification.pdu.varbinds[0].value;    
    let textAlarm = oidCode.oidFunction(oid);
   if (textAlarm !== 'Beacon...'){
    
    if (textAlarm) {
        console.log(`OID recived: ${textAlarm} from ${agentAddr}`);
        sendMessage(`OID recived: ${textAlarm} from ${agentAddr}`,ctx);
    }else{
        console.log(`Unknown OID recived: ${oid} from ${agentAddr}`);
        sendMessage(`Unknown OID recived: ${oid} from ${agentAddr}`,ctx);

    }

   } else {
    console.log(textAlarm);
    upTime = 5*value;
    console.log(`Uptime: ${upTime} Min.`);
   }

    
    console.log(`Value recived: ${value}`);
                   

} */
 

console.log('Snmp Telegram Bot: STARTED');
bot.launch()
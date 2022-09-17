const snmp = require('net-snmp');
const { Telegraf } = require('telegraf')
const trapProcessing = require ('./trapProcessing')
const bot = new Telegraf('5687778700:AAH0gQjZsUjXFD60L8aI3UT8Kew_gsv2Ajg')

// settings
let trapServStatus = false; 
let showTrap = false // by defect the traps are not showed
let showHeartbeat = false; // by defect heartbeat is off
 

let sendMessage = function(text,ctx) {
    try {
                
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
            let trapResult = trapProcessing(notification,showTrap,showHeartbeat);
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
bot.command(['showhb','SHOWHB'],  (ctx) =>{
    showHeartbeat = true;
    ctx.reply('Show heartbeat: ON');
    
});
bot.command(['noshowhb','NOSHOWHB'],  (ctx) =>{
    showHeartbeat = false;
    ctx.reply('Show heartbeat: OFF');

    
});
bot.command(['showtrap','SHOWTRAP'],  (ctx) =>{
    
    showTrap = true;   
    ctx.reply('Show Trap Recived: ON')
});
bot.command(['noshowtrap','NOSHOWTRAP'],  (ctx) =>{
    
    showTrap = false;   
    ctx.reply('Show Trap Recived: OFF')
});

 
console.log('Snmp Telegram Bot: STARTED');
bot.launch()
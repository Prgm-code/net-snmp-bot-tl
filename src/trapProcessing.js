const oidCode = require('./oidCode')
const alarmLogger = require('./alarmLogger');
let alarmValue = "";
let upTime = 0;


 function trapProcessing (notification , showHeartbeat) {
    let agentAddr = notification.pdu.agentAddr;
    let oid = notification.pdu.varbinds[0].oid;
    let value =notification.pdu.varbinds[0].value;    
    let textAlarm = oidCode.oidFunction(oid);
    let timeDuration = alarmLogger(textAlarm, value, oid);
 



   if (value == 1 ){
    alarmValue = '---Start Alarm--'
   }else{
    alarmValue = `--Cancel Alarm --- ${timeDuration}`
   }
    
    if(textAlarm == 'Beacon...') {
        
        console.log(textAlarm);
        upTime = 5*value;
        console.log(`Uptime: ${upTime} Min.`);
        if(showHeartbeat) return (`Heartbeat from ${agentAddr} Uptime: ${upTime} Min.`);
        return;
       };
    
        
        console.log(`Value recived: ${value}`);
           
    
    if (textAlarm !== oid ) {
        console.log(`OID recived: ${textAlarm}//${alarmValue}from ${agentAddr}`);
        return (`OID recived: ${textAlarm}//${alarmValue} from ${agentAddr}`);
    }else{
        console.log(`Unknown OID recived: ${oid}//${alarmValue} from ${agentAddr}`);
        return (`Unknown OID recived: ${oid}//${alarmValue} from ${agentAddr}`);

    };

               



}
module.exports = trapProcessing;

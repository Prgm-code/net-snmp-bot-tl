const oidCode = require('./oidCode')

let upTime = 0;


function trapProcessing (notification ,showTrap, showHeartbeat) {
    let agentAddr = notification.pdu.agentAddr;
    let oid = notification.pdu.varbinds[0].oid;
    let value =notification.pdu.varbinds[0].value;    
    let textAlarm = oidCode.oidFunction(oid);
    if (showTrap) return JSON.stringify(notification, null, 2);
    
    if(textAlarm == 'Beacon...') {
        
        console.log(textAlarm);
        upTime = 5*value;
        console.log(`Uptime: ${upTime} Min.`);
        if(showHeartbeat) return (`Uptime: ${upTime} Min.`);
       };
    
        
        console.log(`Value recived: ${value}`);
           
    
    if (textAlarm) {
        console.log(`OID recived: ${textAlarm} from ${agentAddr}`);
        return (`OID recived: ${textAlarm} from ${agentAddr}`);
    }else{
        console.log(`Unknown OID recived: ${oid} from ${agentAddr}`);
        return (`Unknown OID recived: ${oid} from ${agentAddr}`);

    };

               



}
module.exports = trapProcessing;

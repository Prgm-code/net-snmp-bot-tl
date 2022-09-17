const oidCode = require('./oidCode')

function trapProcessing (notification) {
    let agentAddr = notification.pdu.agentAddr;
    let oid = notification.pdu.varbinds[0].oid;
    let value =notification.pdu.varbinds[0].value;    
    let textAlarm = oidCode.oidFunction(oid);
   if (textAlarm !== 'Beacon...'){
    
    if (textAlarm) {
        console.log(`OID recived: ${textAlarm} from ${agentAddr}`);
        return (`OID recived: ${textAlarm} from ${agentAddr}`);
    }else{
        console.log(`Unknown OID recived: ${oid} from ${agentAddr}`);
        return (`Unknown OID recived: ${oid} from ${agentAddr}`);

    }

   } else {
    console.log(textAlarm);
    upTime = 5*value;
    console.log(`Uptime: ${upTime} Min.`);
   }

    
    console.log(`Value recived: ${value}`);
                   

}
module.exports = trapProcessing;

const oidFunction = function (oid){
    switch(oid){

    case '1.3.6.1.4.1.26061.10.8.1.1': return 'Rec1: General Error';   
    case '1.3.6.1.4.1.26061.10.8.2.1': return 'Rec2: General Error'; 
    case '1.3.6.1.4.1.26061.10.8.3.1': return 'Rec3: General Error'; 

    case '1.3.6.1.4.1.26061.10.8.1.2': return 'Rec1: Input Low AC';
    case '1.3.6.1.4.1.26061.10.8.2.2': return 'Rec2: Input Low AC';
    case '1.3.6.1.4.1.26061.10.8.3.2': return 'Rec3: Input Low AC';

    case '1.3.6.1.4.1.26061.10.8.1.3': return 'Rec1: Temp Sensor Fail';
    case '1.3.6.1.4.1.26061.10.8.1.3': return 'Rec2: Temp Sensor Fail';
    case '1.3.6.1.4.1.26061.10.8.1.3': return 'Rec3: Temp Sensor Fail';

    case '1.3.6.1.4.1.26061.10.8.1.4': return 'Rec1: Temp High';
    case '1.3.6.1.4.1.26061.10.8.2.4': return 'Rec2: Temp High';
    case '1.3.6.1.4.1.26061.10.8.3.4': return 'Rec3: Temp High';
    
    case '1.3.6.1.4.1.26061.10.8.1.5': return 'Rec1: Temp Low';
    case '1.3.6.1.4.1.26061.10.8.2.5': return 'Rec2: Temp Low';
    case '1.3.6.1.4.1.26061.10.8.3.5': return 'Rec3: Temp Low';

    case '1.3.6.1.4.1.26061.10.8.1.6': return 'Rec1: Except Temp High';
    case '1.3.6.1.4.1.26061.10.8.2.6': return 'Rec2: Except Temp High';
    case '1.3.6.1.4.1.26061.10.8.3.6': return 'Rec3: Except Temp High';

    case '1.3.6.1.4.1.26061.10.8.1.7': return 'Rec1: Except Temp Low';
    case '1.3.6.1.4.1.26061.10.8.2.7': return 'Rec2: Except Temp Low';
    case '1.3.6.1.4.1.26061.10.8.3.7': return 'Rec3: Except Temp Low';

    case '1.3.6.1.4.1.26061.10.8.1.8': return 'Rec1: Element Loss/Start	';
    case '1.3.6.1.4.1.26061.10.8.2.8': return 'Rec2: Element Loss/Start	';
    case '1.3.6.1.4.1.26061.10.8.3.8': return 'Rec3: Element Loss/Start	';
    
    case '1.3.6.1.4.1.26061.10.8.1.9': return 'Rec1: Input High (AC)';
    case '1.3.6.1.4.1.26061.10.8.2.9': return 'Rec2: Input High (AC)';
    case '1.3.6.1.4.1.26061.10.8.3.9': return 'Rec3: Input High (AC)';

    case '1.3.6.1.4.1.26061.10.8.1.10': return 'Rec1: AC UVP';
    case '1.3.6.1.4.1.26061.10.8.2.10': return 'Rec2: AC UVP';
    case '1.3.6.1.4.1.26061.10.8.3.10': return 'Rec3: AC UVP';

    case '1.3.6.1.4.1.26061.10.8.1.11': return 'Rec1: AC OVP';
    case '1.3.6.1.4.1.26061.10.8.2.11': return 'Rec2: AC OVP';
    case '1.3.6.1.4.1.26061.10.8.3.11': return 'Rec3: AC OVP';

    case '1.3.6.1.4.1.26061.10.8.1.12': return 'Rec1: DC OVP';
    case '1.3.6.1.4.1.26061.10.8.2.12': return 'Rec2: DC OVP';
    case '1.3.6.1.4.1.26061.10.8.3.12': return 'Rec3: DC OVP';
    
    case '1.3.6.1.4.1.26061.10.8.1.13': return 'Rec1: DC UVP';
    case '1.3.6.1.4.1.26061.10.8.2.13': return 'Rec2: DC UVP';
    case '1.3.6.1.4.1.26061.10.8.3.13': return 'Rec3: DC UVP';

    case '1.3.6.1.4.1.26061.10.8.1.14': return 'Rec1: Over Temp Protect';
    case '1.3.6.1.4.1.26061.10.8.2.14': return 'Rec2: Over Temp Protect';
    case '1.3.6.1.4.1.26061.10.8.3.14': return 'Rec3: Over Temp Protect';

    case '1.3.6.1.4.1.26061.10.8.1.15': return 'Rec1: Input Low Major';
    case '1.3.6.1.4.1.26061.10.8.2.15': return 'Rec2: Input Low Major';
    case '1.3.6.1.4.1.26061.10.8.3.15': return 'Rec3: Input Low Major';

    case '1.3.6.1.4.1.26061.10.8.1.16': return 'Rec1: Input High Major';
    case '1.3.6.1.4.1.26061.10.8.2.16': return 'Rec2: Input High Major';
    case '1.3.6.1.4.1.26061.10.8.3.16': return 'Rec3: Input High Major';

    case '1.3.6.1.4.1.26061.10.8.1.17': return 'Rec1: Fan Failure';
    case '1.3.6.1.4.1.26061.10.8.2.17': return 'Rec2: Fan Failure';
    case '1.3.6.1.4.1.26061.10.8.3.17': return 'Rec3: Fan Failure';

    case '1.3.6.1.4.1.26061.10.8.1.18': return 'Rec1: Power Limit';
    case '1.3.6.1.4.1.26061.10.8.2.18': return 'Rec2: Power Limit';
    case '1.3.6.1.4.1.26061.10.8.3.18': return 'Rec3: Power Limit';

    // OID alarmas PDA
    case '1.3.6.1.4.1.26061.10.8.10.2': return 'PDA: Low Voltage Disconnect'
    case '1.3.6.1.4.1.26061.10.8.10.1': return 'Circuit Breacker Batteries (3,4,5)'

    case '1.3.6.1.4.1.26061.10.8.13' : return 'Beacon...';

    // si no esta definida devuelve la misma
   default: return oid ;
    }
} 
exports.oidFunction = oidFunction;
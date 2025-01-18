const util = require('util');
const timer = util.promisify(setTimeout);
let fs = require('fs');

//let i = 0;

let alarmLogger = function (textAlarm , value, oid) {
    try {
        let date = new Date().getTime();
         fs.appendFile(`./json/${oid}.json`,`{"alarm":"${textAlarm}","time":"${date}" }`, function(err){
            if (err) throw err;
            console.log('Json creado o actualizado');
        });
    }catch(e){
        console.log(e);
    }


    if (value == 1 ){
        //let startDate = new Date().getTime()
    /* do {
        i = i+1;
        await timer(1000);
        console.log(i);

    } while (value == 1); */

    //Start Alarm //logger time alarm 
    return ''

    }else{
    // cancela alarma // logger time cancel alarm 
    // print duration alarm  (time cancel  ) - (time start)
    return ''
    
    }

}

module.exports = alarmLogger


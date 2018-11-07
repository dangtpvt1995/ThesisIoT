'use strict'
module.exports= class Sensor {
    constructor(temp, humi, date,time, number) {
        this.temp = temp;
        this.humi = humi;
        this.date = date;
        this.number = number;
        this.time = time;
    }
}

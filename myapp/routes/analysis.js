var express = require('express');
var router = express.Router();
let daoSensor = require('../DAO/sensorDao');
router.get("/",function(req,res,next){
    res.render('analysis');
   
});
router.post("/sensor1",function(req,res,next){
    var data = req.body;
    var date = data.datePicker;
    var arrDate = date.split("/");
    var dateDB= arrDate[2]+"/"+arrDate[1]+"/"+arrDate[0];
    dataGet=daoSensor.findDataByDate(dateDB,"sensor1");
    dataGet.then(function(result){
        var i03=0,i36=0,i69=0,i912=0,i1215=0,i1518=0,i1821=0,i2124=0;
        var sumT03=0,sumT36=0,sumT69=0;sumT912=0;sumT1215=0;sumT1518=0,sumT1821=0,sumT2124=0;
        var sumH03=0,sumH36=0,sumH69=0;sumH912=0;sumH1215=0;sumH1518=0,sumH1821=0,sumH2124=0;
        result.forEach(e => {
            if(e.time >= "00:00" && e.time <= "03:00"){
               i03++;
               sumT03+=e.temp;
               sumH03+=e.humi;
            }
            if(e.time > "03:00" && e.time <= "06:00"){
                i36++;
               sumT36+=e.temp;
               sumH36+=e.humi;
            }
            if(e.time > "06:00" && e.time <= "09:00"){
                i69++;
               sumT69+=e.temp;
               sumH69+=e.humi;
            }
            if(e.time > "09:00" && e.time <= "12:00"){
                i912++;
               sumT912+=e.temp;
               sumH912+=e.humi;
            }
            if(e.time > "12:00" && e.time <= "15:00"){
                i1215++;
               sumT1215+=e.temp;
               sumH1215+=e.humi;
            }
            if(e.time > "15:00" && e.time <= "18:00"){
                i1518++;
               sumT1518+=e.temp;
               sumH1518+=e.humi;
            }
            if(e.time > "18:00" && e.time <= "21:00"){
                i1821++;
               sumT1821+=e.temp;
               sumH1821+=e.humi;
            }
            if(e.time > "21:00" && e.time <= "24:00"){
               i2124++;
               sumT2124+=e.temp;
               sumH2124+=e.humi;
            }
        });
        var tbT03= isNaN(sumT03/i03)?0:(sumT03/i03).toFixed(3);
        var tbT36= isNaN(sumT36/i36)?0:(sumT36/i36).toFixed(3);
        var tbT69= isNaN(sumT69/i69)?0:(sumT69/i69).toFixed(3);
        var tbT912= isNaN(sumT912/i912)?0:(sumT912/i912).toFixed(3);
        var tbT1215= isNaN(sumT1215/i1215)?0:(sumT1215/i1215).toFixed(3);
        var tbT1518= isNaN(sumT1518/i1518)?0:(sumT1518/i1518).toFixed(3);
        var tbT1821= isNaN(sumT1821/i1821)?0:(sumT1821/i1821).toFixed(3);
        var tbT2124= isNaN(sumT2124/i2124)?0:(sumT2124/i2124).toFixed(3);
        var tempFullDay=[tbT03,tbT36,tbT69,tbT912,tbT1215,tbT1518,tbT1821,tbT2124]
        var tbH03= isNaN(sumH03/i03)?0:(sumH03/i03).toFixed(3);
        var tbH36= isNaN(sumH36/i36)?0:(sumH36/i36).toFixed(3);
        var tbH69= isNaN(sumH69/i69)?0:(sumH69/i69).toFixed(3);
        var tbH912= isNaN(sumH912/i912)?0:(sumH912/i912).toFixed(3);
        var tbH1215= isNaN(sumH1215/i1215)?0:(sumH1215/i1215).toFixed(3);
        var tbH1518= isNaN(sumH1518/i1518)?0:(sumH1518/i1518).toFixed(3);
        var tbH1821= isNaN(sumH1821/i1821)?0:(sumH1821/i1821).toFixed(3);
        var tbH2124= isNaN(sumH2124/i2124)?0:(sumH2124/i2124).toFixed(3);
        var humiFullDay=[tbH03,tbH36,tbH69,tbH912,tbH1215,tbH1518,tbH1821,tbH2124]
        var dataSend={
            tempFullDay:tempFullDay,
            humiFullDay:humiFullDay
        }
        dataSend = JSON.stringify(dataSend);
        res.status(200).json({
            data:dataSend
        });
    }).catch(function(err){
        if(err){
            throw err;
        }
    });
   
   // res.write("hello world");
    
});
router.post("/sensor2",function(req,res,next){
    
    var data = req.body;
    var date = data.datePicker;
    var arrDate = date.split("/");
    var dateDB= arrDate[2]+"/"+arrDate[1]+"/"+arrDate[0];
    dataGet=daoSensor.findDataByDate(dateDB,"sensor2");
    dataGet.then(function(result){
        var i03=0,i36=0,i69=0,i912=0,i1215=0,i1518=0,i1821=0,i2124=0;
        var sumT03=0,sumT36=0,sumT69=0;sumT912=0;sumT1215=0;sumT1518=0,sumT1821=0,sumT2124=0;
        var sumH03=0,sumH36=0,sumH69=0;sumH912=0;sumH1215=0;sumH1518=0,sumH1821=0,sumH2124=0;
        result.forEach(e => {
            if(e.time >= "00:00" && e.time <= "03:00"){
               i03++;
               sumT03+=e.temp;
               sumH03+=e.humi;
            }
            if(e.time > "03:00" && e.time <= "06:00"){
                i36++;
               sumT36+=e.temp;
               sumH36+=e.humi;
            }
            if(e.time > "06:00" && e.time <= "09:00"){
                i69++;
               sumT69+=e.temp;
               sumH69+=e.humi;
            }
            if(e.time > "09:00" && e.time <= "12:00"){
                i912++;
               sumT912+=e.temp;
               sumH912+=e.humi;
            }
            if(e.time > "12:00" && e.time <= "15:00"){
                i1215++;
               sumT1215+=e.temp;
               sumH1215+=e.humi;
            }
            if(e.time > "15:00" && e.time <= "18:00"){
                i1518++;
               sumT1518+=e.temp;
               sumH1518+=e.humi;
            }
            if(e.time > "18:00" && e.time <= "21:00"){
                i1821++;
               sumT1821+=e.temp;
               sumH1821+=e.humi;
            }
            if(e.time > "21:00" && e.time <= "24:00"){
               i2124++;
               sumT2124+=e.temp;
               sumH2124+=e.humi;
            }
        });
        var tbT03= isNaN(sumT03/i03)?0:(sumT03/i03).toFixed(3);
        var tbT36= isNaN(sumT36/i36)?0:(sumT36/i36).toFixed(3);
        var tbT69= isNaN(sumT69/i69)?0:(sumT69/i69).toFixed(3);
        var tbT912= isNaN(sumT912/i912)?0:(sumT912/i912).toFixed(3);
        var tbT1215= isNaN(sumT1215/i1215)?0:(sumT1215/i1215).toFixed(3);
        var tbT1518= isNaN(sumT1518/i1518)?0:(sumT1518/i1518).toFixed(3);
        var tbT1821= isNaN(sumT1821/i1821)?0:(sumT1821/i1821).toFixed(3);
        var tbT2124= isNaN(sumT2124/i2124)?0:(sumT2124/i2124).toFixed(3);
        var tempFullDay=[tbT03,tbT36,tbT69,tbT912,tbT1215,tbT1518,tbT1821,tbT2124]
        var tbH03= isNaN(sumH03/i03)?0:(sumH03/i03).toFixed(3);
        var tbH36= isNaN(sumH36/i36)?0:(sumH36/i36).toFixed(3);
        var tbH69= isNaN(sumH69/i69)?0:(sumH69/i69).toFixed(3);
        var tbH912= isNaN(sumH912/i912)?0:(sumH912/i912).toFixed(3);
        var tbH1215= isNaN(sumH1215/i1215)?0:(sumH1215/i1215).toFixed(3);
        var tbH1518= isNaN(sumH1518/i1518)?0:(sumH1518/i1518).toFixed(3);
        var tbH1821= isNaN(sumH1821/i1821)?0:(sumH1821/i1821).toFixed(3);
        var tbH2124= isNaN(sumH2124/i2124)?0:(sumH2124/i2124).toFixed(3);
        var humiFullDay=[tbH03,tbH36,tbH69,tbH912,tbH1215,tbH1518,tbH1821,tbH2124]
        var dataSend={
            tempFullDay:tempFullDay,
            humiFullDay:humiFullDay
        }
        dataSend = JSON.stringify(dataSend);
        res.status(200).json({
            data:dataSend
        });
    }).catch(function(err){
        if(err){
            throw err;
        }
    });
   
    
});
module.exports = router;
var express = require('express');
var router = express.Router();
let daoSensor = require('../DAO/sensorDao');
router.get("/", function (req, res) {
  res.render("sensor2", { data: { } });
});

router.get("/download", function (req, res, next) {
  
  var day= moment().date();
  var month = moment().month()+1;
  var year = moment().year();
   var now = year+"/"+month+"/"+day;
 
  var data = daoSensor.findDataByDate(now,"sensor1");
  data.then(function (data) {
    if (data) {
      res.render("sensor2", { data: { dataAll: data } });
    }
  }).catch(function (err) {
  });
});
router.post("/", function (req, res, next) {
  var data = {
    date :req.body.datePicker,
    frmTime : req.body.frmTime,
    toTime : req.body.toTime,
  }
  var date = data.date;
  var frmTime = data.frmTime;
  var toTime = data.toTime;
  var dateArr = date.split("/");
  var dateDB = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
  if(frmTime !== "" && toTime !==""){
    var data = daoSensor.findDataByDateTime(dateDB,"sensor1",frmTime,toTime);
  }
  else if(frmTime !=""){
    let toTime = "23:59:59";
    var data = daoSensor.findDataByDateTime(dateDB,"sensor1",frmTime,toTime);
  }
  else if(toTime !=""){
    let frmTime = "00:00:00";
    var data = daoSensor.findDataByDateTime(dateDB,"sensor1",frmTime,toTime);
  }

  else if(frmTime =="" && toTime ==""){
    var data = daoSensor.findDataByDate(dateDB,"sensor1");
  }
  data.then(function (data, err) {
    var sumTemp = 0;
    var sumHumi = 0;
    if (data) {
      var maxTemp = 0, minTemp = 0, maxHumi = 0, minHumi = 0;
      for (const key in data) {
        var a = new Date(data[0].date);
        var maxTimeTemp,minTimeTemp,maxTimeHumi,minTimeHumi ;
        let day = a.getDate() < 10 ? "0" + a.getDate() : a.getDate();
        let month = a.getMonth() + 1 < 10 ? "0" + a.getMonth() + 1 : a.getMonth() + 1;
        let year = a.getFullYear();
        var date = day + "/" + month + "/" + year;
        var maxTemp = data[0].temp;
        var maxHumi = data[0].humi;
        var minTemp = data[0].temp;
        var minHumi = data[0].humi;
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          sumTemp += element.temp;
          sumHumi += element.humi;
          if (element.temp >= maxTemp) {
            maxTemp = element.temp;
            maxTimeTemp= element.time;
          }
          if (element.temp <= minTemp) {
            minTemp = element.temp;
            minTimeTemp = element.time;
          }
          if (element.humi >= maxHumi) {
            maxHumi = element.humi;
            maxTimeHumi = element.time;
          }
          if (element.temp <= minHumi) {
            minHumi = element.humi;
            minTimeHumi = element.time;
          }
        }
      }
      let avgHumi = (sumHumi / data.length).toFixed(3);
      let avgTemp = (sumTemp / data.length).toFixed(3);
      res.status(200).json({
        data:
        {
          dataAll: data,
          maxTemp: maxTemp,
          minTemp: minTemp,
          minHumi: minHumi,
          maxHumi: maxHumi,
          avgHumi: avgHumi,
          avgTemp: avgTemp,
          dateFind: date,
          maxTimeTemp:maxTimeTemp,
          minTimeTemp:minTimeTemp,
          maxTimeHumi:maxTimeHumi,
          minTimeHumi:minTimeHumi
        }
      });
    }
  }).catch(function (err) {
    console.log(err);
  });
});

module.exports = router;
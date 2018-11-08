var express = require('express');
var router = express.Router();
let daoSensor = require('../DAO/sensorDao');
router.get("/", function (req, res) {
    var data = daoSensor.getAllData("sensor2");
    data.then(function (data,err) {
      if (data) {
        console.log(data)
        res.render("sensor2", { data: { dataAll: data } });
      }
    }).catch(function (err) {
      console.log(err);
    });
  });

  router.post("/", function (req, res, next) {
    let date = req.body.date;
    let dateArr = date.split("/");
    let dateDB = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
    let data = daoSensor.findDataByDate(dateDB, "sensor2");
  
    data.then(function (data, err) {
      var sumTemp = 0;
      var sumHumi = 0;
      if (data) {
        var maxTemp = 0, minTemp = 0, maxHumi = 0, minHumi = 0;
        for (const key in data) {
          var a = new Date(data[0].date);
          let day = a.getDate() < 10 ? "0" + a.getDate() : a.getDate();
          let month = a.getMonth() + 1 < 10 ? "0" + a.getMonth() + 1 : a.getMonth() + 1;
          let year = a.getFullYear();
          let date = day + "/" + month + "/" + year;
          var maxTemp = data[0].temp;
          var maxHumi = data[0].humi;
          var minTemp = data[0].temp;
          var minHumi = data[0].humi;
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            sumTemp += element.temp;
            sumHumi += element.humi;
            if (element.temp > maxTemp) {
              maxTemp = element.temp;
            }
            if (element.temp < minTemp) {
              minTemp = element.temp;
            }
            if (element.humi > maxHumi) {
              maxHumi = element.humi;
            }
            if (element.temp < minHumi) {
              minHumi = element.humi;
            }
          }
        }
        let avgHumi = (sumHumi / data.length).toFixed(3);
        let avgTemp = (sumTemp / data.length).toFixed(3);
        res.render("sensor2", {
          data:
          {
            dataAll: data,
            maxTemp: maxTemp,
            minTemp: minTemp,
            minHumi: minHumi,
            maxHumi: maxHumi,
            avgHumi: avgHumi,
            avgTemp: avgTemp,
            dateFind: date
          }
        });
      }
    }).catch(function (err) {
      console.log(err);
    });
  });

  module.exports = router;
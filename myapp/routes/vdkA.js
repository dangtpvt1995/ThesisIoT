
var express = require('express');
var router = express.Router();
let daoSensor = require('../DAO/sensorDao');
let moment = require('moment');
// var dataInPdf = {
//   date: null,
//   frmTime: null,
//   toTime: null
// }
var v8 = require('v8');

const totalHeapSize = v8.getHeapStatistics().total_available_size;

// router.get("/download", function (req, res, next) {
//   // var data = daoSensor.getAllData("sensor1");
//   console.log(dataInPdf);
//   var dateArr = dataInPdf.date.split("/");
//   var dateDB = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
//   if (frmTime !== "" && toTime !== "") {
//     var data = daoSensor.findDataByDateTime(dateDB, "sensor1", frmTime, toTime);
//   }
//   else if (frmTime == "" && toTime == "") {
//     var data = daoSensor.findDataByDate(dateDB, "sensor1");
//   }
//   data.then(function (data) {
//     if (data) {
//       res.send(JSON.stringify(data));
//     }
//   }).catch(function (err) {
//   });

// });

router.get("/", function (req, res, next) {

  var day = moment().date();
  var month = moment().month() + 1;
  var year = moment().year();
  var now = year + "/" + month + "/" + day;

  var data = daoSensor.findDataByDate(now, "sensor1");
  data.then(function (data) {
    if (data) {
      res.render("vdkA", { data: { dataAll: data } });
    }
  }).catch(function (err) {
  });
});

router.post("/", function (req, res, next) {
  var data = {
    date: req.body.datePicker,
    frmTime: req.body.frmTime,
    toTime: req.body.toTime,
  }
  dataInPdf = data.date;
  dataInPdf.frmTime = data.frmTime;
  dataInPdf.toTime = data.toTime;


  var date = data.date;
  var frmTime = data.frmTime?data.frmTime:"00:00";
  var toTime = data.toTime?data.toTime:"23:59";
  //Đổi ra giây để tính
  var labels = [];
  var frTimeArr = frmTime.split(":");
  var secfrTime = Number(frTimeArr[0] * 60 * 60) + Number(frTimeArr[1] * 60);
  var toTimeArr = toTime.split(":");
  var secToTime = Number(toTimeArr[0] * 60 * 60) + Number(toTimeArr[1] * 60);
  var timeResult = secToTime - secfrTime;
  var dateArr = date.split("/");
  var dateDB = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
  if (frmTime == "" && toTime == "") {
    var data = daoSensor.findDataByDate(dateDB, "sensor1");
  }
  else {
    var data = daoSensor.findDataByDateTime(dateDB, "sensor1", frmTime, toTime);
  }

  data.then(function (data, err) {
    if (data.length !== 0) {
      var sumTemp = 0;
      var sumHumi = 0;
      var humiArr = [];
      var tempArr = [];
      var maxTemp = 0, minTemp = 0, maxHumi = 0, minHumi = 0;
      var variancesTemp = 0; standardTemp = 0; variancesHumi = 0; standardHumi = 0;
      var length = data.length;
      var maxTemp = data[0].temp;
      var maxHumi = data[0].humi;
      var minTemp = data[0].temp;
      var minHumi = data[0].humi;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          sumTemp += element.temp;
          sumHumi += element.humi;
          maxTemp = Math.max(maxTemp, element.temp);
          minTemp = Math.min(minTemp, element.temp);
          maxHumi = Math.max(maxHumi, element.humi);
          minHumi = Math.min(minHumi, element.humi);
        }
      }
      var avgHumi = (sumHumi / length).toFixed(3);
      var avgTemp = (sumTemp / length).toFixed(3);
      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          const e = data[i];
          variancesHumi += Math.pow(e.humi - avgHumi, 2);
          variancesTemp += Math.pow(e.temp - avgTemp, 2)
        }
      }
      variancesHumi = variancesHumi / (length - 1);
      variancesTemp = variancesTemp / (length - 1);
      standardTemp = Math.pow(variancesTemp, 1 / 2);
      standardHumi = Math.pow(variancesHumi, 1 / 2);
      //Tính để vẽ biểu đồ
      // 5 phut
      var countTime = 1;
      var checkScope = 20;
      while (true) {
        if (length <= checkScope) {
          var count = 1;
          var tempGet = 0;
          var humiGet = 0;
          var label = "";
          var checkLastTime = length;
          for (const a in data) {
            if (data.hasOwnProperty(a)) {
              const element = data[a];
              if (checkLastTime <= countTime) {
                countTime = checkLastTime;
              }
              if (count < countTime) {
                tempGet += element.temp;
                humiGet += element.humi;
                count++;
              }
              else {
                tempGet = (tempGet / count).toFixed(3);
                humiGet = (humiGet / count).toFixed(3);
                tempArr.push(tempGet);
                humiArr.push(humiGet);
                count = 1;
                tempGet = 0;
                humiGet = 0;
                checkLastTime -= countTime;
              }
            };
          }
          var labelApprox= Math.ceil (timeResult/humiArr.length);
          for (var b = secfrTime; b <= secToTime-labelApprox; b += labelApprox) {
            label = b;
            labels.push(label);
          }
          if(labels.length<humiArr.length){
            labels.push(secToTime);
          }
          break;
        }
        else {
          checkScope += 20;
          countTime++;
        }
      }
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
          variancesHumi: variancesHumi.toFixed(6),
          variancesTemp: variancesTemp.toFixed(6),
          standardTemp: standardTemp.toFixed(6),
          standardHumi: standardHumi.toFixed(6),
          labels: labels,
          humiArr: humiArr,
          tempArr: tempArr

        }
      });
    }
  }).catch(function (err) {
    console.log(err);
  });

});

module.exports = router;
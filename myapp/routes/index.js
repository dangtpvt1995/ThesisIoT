var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var config = require('config');
let daoSensor = require('../DAO/sensorDao');
let Sensor = require('../DTO/sensor.js')
var validator = require('is-json');

//Định dạng topic
const topicVDKASensor = config.get("mqtt_config.topic_VDKA.sensor");
const topicVDKBSensor = config.get("mqtt_config.topic_VDKB.sensor");
const topicClientDevices = config.get("mqtt_config.topic_client.all");
const topicEmergency= config.get("mqtt_config.topic_emergency");
const vdkARes = config.get("mqtt_config.topic_CONTROLLER_RESPONE.vdkA");
const vdkBRes = config.get("mqtt_config.topic_CONTROLLER_RESPONE.vdkB");
const clientWeb =  config.get("mqtt_config.topic_client.webApp");
let count = 0;
//Kết nối
let client = mqtt.connect(config.get("mqtt_config.webapp_option.host"), config.get("mqtt_config.webapp_option"));
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Luận văn IoT'
  });
});
router.get('/load', function (req, res, next) {
  client.end();
  client = mqtt.connect(config.get("mqtt_config.webapp_option.host"),config.get("mqtt_config.webapp_option"));
  console.log("reconnect");
  res.redirect('/');
});
client.on('connect', function () {
  client.publish(clientWeb,'{"id":"webApp","status":1}',{qos:2,retain:true},function(err){
    if(err) throw err;
})
  router.get('/stream', function (req, res, next) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    // Timeout timer, send a comment line every 20 sec
    var timer = setInterval(function () {
      res.write('event: ping' + '\n\n');
    }, 20000);
    client.subscribe(topicVDKASensor, function (err) {
      if (err) throw err
    });
    client.subscribe(topicVDKBSensor, function (err) {
      if (err) throw err
    });
    client.subscribe(topicClientDevices, function (err) {
      if (err) throw err;
    });
    client.subscribe(topicEmergency, function (err) {
      if (err) throw err;
    });
    client.subscribe(vdkARes, function (err) {
      if (err) throw err;
    });
    client.subscribe(vdkBRes, function (err) {
      if (err) throw err;
    });

    client.on('message', function (topic, msg, pkt) {
      var topicArr = topic.split("/");
      console.log(topicArr);
      console.log(msg.toString());
      //topic của Devices
      if (topicArr[1] == "DEVICES") {
        if (topicArr[2] == "VDKA") {
          if (validator(msg.toString())) {
            msg = JSON.parse(msg);
            if (topicArr[3] == "SENSOR") {
              var dataSend = {
                content: "dataSensor",
                time: msg.time,
                temp: msg.temp,
                humi: msg.humi
              }
              dataSend = JSON.stringify(dataSend);
              res.write("id: " + "vdkA\n");
              res.write("data: " + dataSend + "\n\n");
              console.log("Tiến hành lưu vào DB Sensor1")
              let sensor = new Sensor(msg.temp, msg.humi, msg.date, msg.time, msg.number);
              daoSensor.addData("sensor1", sensor);
            }
          }
        }
         if (topicArr[2] == "VDKB") {
          if (validator(msg.toString())) {
            msg = JSON.parse(msg);
            if (topicArr[3] == "SENSOR") {
              var dataSend = {
                content: "dataSensor",
                time: msg.time,
                temp: msg.temp,
                humi: msg.humi
              }
              dataSend = JSON.stringify(dataSend);
              res.write("id: " + "vdkB\n");
              res.write("data: " + dataSend + "\n\n");
              console.log("Tiến hành lưu vào DB Sensor2")
              let sensor = new Sensor(msg.temp, msg.humi, msg.date, msg.time, msg.number);
              daoSensor.addData("sensor2", sensor);
            }
          }
        }
      }
      //topic của client
      if (topicArr[1] == "CLIENT") {
        if (topicArr[2] == "VDKA") {
          msg = JSON.parse(msg);
          var status = msg.status;
          var dataSend = {
            content: "clientStatus",
            status: status
          };
          dataSend = JSON.stringify(dataSend);
          res.write("id: " + "vdkA\n");
          res.write("data: " + dataSend + "\n\n");
        }
        if (topicArr[2] == "VDKB") {
          msg = JSON.parse(msg);
          var status = msg.status;
          var dataSend = {
            content: "clientStatus",
            status: status
          };
          dataSend = JSON.stringify(dataSend);
          res.write("id: " + "vdkB\n");
          res.write("data: " + dataSend + "\n\n");
        }
      }
      //topic của Emergence
      if(topicArr[1]=="EMERGENCE"){
        if(topicArr[2]=="VDKA"){
          msg = JSON.parse(msg);
          if(msg.code="ERRSSDHT11OFF"){
            var dataSend={
              content:"err",
              errCode:"ERRSSDHT11OFF"
            }
            dataSend=JSON.stringify(dataSend);
            res.write("id: " + "vdkA\n");
            res.write("data: " + dataSend + "\n\n");
          }
        };
        if(topicArr[2]=="VDKB"){
          msg = JSON.parse(msg);
          if(msg.code="ERRSSDHT11OFF"){
            var dataSend={
              content:"err",
              errCode:"ERRSSDHT11OFF"
            }
            dataSend=JSON.stringify(dataSend);
            res.write("id: " + "vdkB\n");
            res.write("data: " + dataSend + "\n\n");
          }
        }
      }
      //Topic của Controller
      if (topicArr[1] === "CONTROLLER") {
        if (topicArr[2] === "VDKA") {
            if (topicArr[3] === "RESPONSE") {
                if (topicArr[4] === "LED") {
                    var msg = JSON.parse(msg);
                    var stt = Number(msg.status);
                    if (stt === 1) {
                        var status = 1;
                    }
                    else {
                        var status = 0;
                    }
                    var data = {
                        content: "ledRes",
                        status: status
                    }
                    data = JSON.stringify(data);
                    res.write("id: vdkA\n");
                    res.write("data: " + data + "\n\n");

                }
            }
        }
        if (topicArr[2] === "VDKB") {
            if (topicArr[3] === "RESPONSE") {
                if (topicArr[4] === "LED") {
                    var msg = JSON.parse(msg);
                    var stt = Number(msg.status);
                    if (stt === 1) {
                        var status = 1;
                    }
                    else {
                        var status = 0;
                    }
                    var data = {
                        content: "ledRes",
                        status: status
                    };
                    data = JSON.stringify(data);
                    res.write("id: vdkB\n");
                    res.write("data: " + data + "\n\n");

                }
            }
        }
    }
    });
  });



});

client.on("error", function (error) {
  console.log("Không thể kết nối " + error);
  process.exit(1);
});

module.exports = router;


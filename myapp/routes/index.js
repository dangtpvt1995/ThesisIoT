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

let count = 0;
//Kết nối
let clientID = config.get("mqtt_config.mqtt_option.clientId") || "Invalid";
let client = mqtt.connect(config.get("mqtt_config.mqtt_option.host"), config.get("mqtt_config.mqtt_option"));


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Luận văn IoT',
    connected: client.connected,
    server: config.get("mqtt_config.mqtt_option.host"),
    topic: "PROJECT",
    clientID: clientID
  });
});

client.on('connect', function () {
  router.get('/stream', function (req, res,next) {
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
    client.on('message', function (topic, msg, pkt) {
      var topic = topic;
      var topicArr = topic.split("/")
      if (topicArr[1] == "VDKA") {
        if (validator(msg.toString())) {
          res.write("data: " + msg + "\n\n");
          if (topicArr[2] == "SENSOR") {
            msg = JSON.parse(msg);
            console.log("Tiến hành lưu vào DB Sensor1")
            let sensor = new Sensor(msg.temp, msg.humi, msg.date, msg.time, msg.number);
            daoSensor.addData("sensor1", sensor);
          }
        }
        else {
          console.log("Message của topic PROJECT/VDKA/SENSOR không hợp lệ ")
        }
      }
      else if (topicArr[1] == "VDKB") {
        if (validator(msg.toString())) {
          res.write("data: " + msg + "\n\n");
          if (topicArr[2] == "SENSOR") {
            msg = JSON.parse(msg);
            console.log("Tiến hành lưu vào DB Sensor2")
            let sensor = new Sensor(msg.temp, msg.humi, msg.date, msg.time, msg.number);
            daoSensor.addData("sensor2", sensor);
          }
        }
        else {
          console.log("Message của topic PROJECT/VDKB/SENSOR không hợp lệ ")
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


var express = require('express');
var router = express.Router();

var mqtt = require('mqtt');
var config = require('config');
let daoSensor = require('../DAO/sensorDao');
let Sensor = require('../DTO/sensor.js')
var validator = require('is-json');


let count = 0;
/* GET home page. */
let will = {
  topic: "test",
  payload: "MQTT is dead",
  qos: 1,
  retain: true
}
let topic = config.get("mqtt_config.mqtt_client_topic");
let msg = "Succesfull connection";
let clientID = config.get("mqtt_config.mqtt_option.clientId") || "Invalid";
let client = mqtt.connect(config.get("mqtt_config.mqtt_option.host"), config.get("mqtt_config.mqtt_option"), will);
const api = "e045ca14-c099-4a1f-bc85-fe5f148e97f7";

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
  router.get('/stream', function (req, res) {
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

    client.subscribe(topic, { qos: 2 }, function () {
      client.on('message', function (topic, msg, pkt) {
        if (topic.slice(topic.indexOf("/") + 1, topic.lastIndexOf("/")) == "SENSOR1") {
          if (validator(msg.toString())) {
            res.write("data: " + msg + "\n\n");

            if (topic.slice(topic.lastIndexOf("/") + 1) == "ON") {
              msg = JSON.parse(msg);
              console.log("Tiến hành lưu vào DB Sensor1")
              let sensor = new Sensor(msg.temp, msg.humi, msg.date, msg.time, msg.number);
              daoSensor.addData("sensor1", sensor);
            }
            else if (topic.slice(topic.lastIndexOf("/")) == "OFF") {
              console.log("Sensor 1 đang ngoại tuyến");
            }
          }
          else {
            console.log("Message của topic PROJECT/SENSOR1/+ không hợp lệ ")
          }
        }
        else if (topic.slice(topic.indexOf("/") + 1, topic.lastIndexOf("/")) == "SENSOR2") {
          if (validator(msg.toString())) {
            res.write("data: " + msg + "\n\n");
            if (topic.slice(topic.lastIndexOf("/") + 1) == "ON") {
              msg = JSON.parse(msg);
              console.log("Tiến hành lưu vào DB Sensor2")
              let sensor = new Sensor(msg.temp, msg.humi, msg.date, msg.time, msg.number);
              daoSensor.addData("sensor2", sensor);
            }
            else if (topic.slice(topic.lastIndexOf("/")) == "OFF") {
              console.log("Sensor 2 đang ngoại tuyến");
            }
          }
          else {
            console.log("Message của topic PROJECT/SENSOR2/+ không hợp lệ ")
          }
        }
        else {
          console.log("Topic không được đăng kí với hệ thống");
        }
      });
    });
  });


});

client.on("error", function (error) {
  console.log("Không thể kết nối " + error);
  process.exit(1);
});

module.exports = router;

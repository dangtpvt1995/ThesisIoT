var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var config = require('config');
const options={
    "port": 16543,
    "host": "mqtt://m15.cloudmqtt.com",
    "username": "computer_controller",
    "password": "1234",
    "keepalive": 60,
    "clientId": "mqttclient03",
    "reconnectPeriod": 500,
    "protocolId": "MQIsdp",
    "protocolVersion": 3,
    "clean": false,
    "encoding": "utf8",
    "queueQoSZero":false,
    "clean":false,
    "connectTimeout":30000
}
var client =mqtt.connect(config.get("mqtt_config.mqtt_option.host"), options);
require('events').EventEmitter.defaultMaxListeners = 200;
router.get("/", function (req, res, next) {
    res.render("controller", { data: {} });
});
router.get('/load',function(req,res,next){
     client.end();
     client=mqtt.connect(config.get("mqtt_config.mqtt_option.host"), options);
     console.log("reconnect");
    res.redirect('/controller');
});
const topicSensor1 = "PROJECT/CONTROLLER/SENSOR1";
const topicSensor2 = "PROJECT/CONTROLLER/SENSOR2";
const topicSensorRes = "PROJECT/CONTROLLER/+/RESPONSE";
const topicSensor1Status="PROJECT/SENSOR/SENSOR1/OFF";
const topicSensor2Status="PROJECT/SENSOR/SENSOR2/OFF";

client.on('connect', function () {
    router.get('/stream', function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        res.write('\n');
        setInterval(function () {
            res.write('event: ping' + '\n\n');
        }, 1000);
        
        client.subscribe(topicSensorRes, function (err) {
            if (err) {
                console.log(err);
            }
            else{
                client.on("message", function (topic, msg, package) {                  
                    var array = topic.split("/");
                    if (array[2] == "SENSOR1") {
                        res.write("id: " + "sensor1\n");
                        res.write("data: " + msg + "\n\n"); 
                       
                    }
                    else {
                        res.write("id: " + "sensor2\n");
                        res.write("data: " + msg + "\n\n");
                    }
                });
            }
        });
        client.subscribe(topicSensor1Status,function(err){
            if(err) throw err;
            else{
                client.on("message",function(topic, msg, package){
                    let msgOff={
                        msg:"offline"
                    };
                    msgOff = JSON.stringify(msgOff); 
                    res.write("id: " + "sensor1\n");
                    res.write("data: " + msgOff + "\n\n");
                });
            }
        });
        client.subscribe(topicSensor2Status,function(err){
            if(err) throw err;
            else{
                client.on("message",function(topic, msg, package){
                    let msgOff={
                        msg:"offline"
                    };
                    msgOff = JSON.stringify(msgOff); 
                    console.log(topic);
                    res.write("id: " + "sensor2\n");
                    res.write("data: " + msgOff + "\n\n");
                });
            }
        });
});
router.post("/", function (req, res, next) {
    var data = {
        id: req.body.id,
        status: req.body.status
    }
    res.status(201).json({
        message: "nothing",
        data: data
    });
    var id = data.id;
    var status = data.status;
    var msg = "";
    if (id === "sensor1") {
        if (status === "ON") {
            status = 1;
        }
        else if (status === "OFF") {
            status = 0;
        }
        msg = {
            status: status
        }
        msg = JSON.stringify(msg);


        client.publish(topicSensor1, msg, { qos: 2, retain: false }, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    if (id === "sensor2") {
        if (status === "ON") {
            status = 1;
        }
        else if (status === "OFF") {
            status = 0;
        }
        msg = {
            status: status
        }
        msg = JSON.stringify(msg);

        client.publish(topicSensor2, msg, { qos: 2, retain: false, dup: false }, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
});
    
});



module.exports = router;
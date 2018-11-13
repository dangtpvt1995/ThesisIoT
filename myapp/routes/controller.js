var express = require('express');
var router = express.Router();
var client = require('../common/mqttConnect.js');

require('events').EventEmitter.defaultMaxListeners = 200;
router.get("/", function (req, res, next) {
    res.render("controller", { data: {} });
});

const topicSensor1 = "PROJECT/CONTROLLER/SENSOR1";
const topicSensor2 = "PROJECT/CONTROLLER/SENSOR2";
const topicSensor1Res = "PROJECT/CONTROLLER/SENSOR1/RESPONSE";
const topicSensor2Res = "PROJECT/CONTROLLER/SENSOR2/RESPONSE";




client.on('connect', function () {
    router.post("/", function (req, res, next) {
        var data={
            id:req.body.id,
            status:req.body.status
        }
        res.status(201).json({
            message:"nothing",
            data:data
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
            console.log(msg);

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
            console.log(msg);

            client.publish(topicSensor2, msg, { qos: 2, retain: false, dup: false }, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
    router.get('/stream', function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write('\n');
           setInterval(function () {
              res.write('event: ping' + '\n\n');
         }, 1000);
        client.subscribe(topicSensor1Res, { qos: 1 }, function (err) {
            if (err) {
                console.log(err);
            }
            else{
                client.on("message", function (topic, msg, package) {
                    console.log(msg.toString());
                    res.write("id: "+"sensor1\n");
                    res.write("data: " + msg + "\n\n");
                });
            }
        });
        client.subscribe(topicSensor2Res, { qos: 1 }, function (err) {
            if (err) {
                console.log(err);
            }
            else{
                client.on("message", function (topic, msg, package) {
                    console.log(msg.toString());
                    res.write("data: " + msg + "\n\n");
                });
            }
        });
    });

});



module.exports = router;
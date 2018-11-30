var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var config = require('config');
var checkJson = require('is-json');
var client = mqtt.connect(config.get("mqtt_config.controller_option.host"), config.get("mqtt_config.controller_option"));
var daoSensor = require('../DAO/sensorDao');

router.get("/", function (req, res, next) {
    res.render("controller", { data: {} });
});
router.get('/load', function (req, res, next) {
    client.end();
    client = mqtt.connect(config.get("mqtt_config.controller_option.host"), config.get("mqtt_config.controller_option"));
    console.log("reconnect");
    res.redirect('/controller');
});

// const topicClient = config.get("mqtt_config.topic_client");
const vdkAWork = config.get("mqtt_config.topic_VDKA.work");
const vdkBWork = config.get("mqtt_config.topic_VDKB.work");
const vdkALedOn = config.get("mqtt_config.topic_VDKA.ledOn");
const vdkALedOff = config.get("mqtt_config.topic_VDKA.ledOff");
const vdkBLedOn = config.get("mqtt_config.topic_VDKB.ledOn");
const vdkBLedOff = config.get("mqtt_config.topic_VDKB.ledOff");
const vdkARes = config.get("mqtt_config.topic_CONTROLLER_RESPONE.vdkA");
const vdkBRes = config.get("mqtt_config.topic_CONTROLLER_RESPONE.vdkB");
const clientManager = config.get("mqtt_config.topic_client.all");
const topicEmergency = config.get("mqtt_config.topic_emergency");
const topicManager = config.get("mqtt_config.topic_manager.sensor");
const topicRequestAll = config.get("mqtt_config.topic_CONTROLLER_RESQUEST.requestAll");
var statusvdkA = null, statusvdkB = null;
var countJobWork = 0; // Dem so chu trinh thuc hien
var logTimeA = {
    date: null,
    timein: null,
    timeout: null
}
var logTimeB = {
    date: null,
    timein: null,
    timeout: null
}
//tạo function get day
function getCurrentTime() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = (currentDate.getMonth() + 1) < 10 ? "0" + currentDate.getMonth() + 1 : currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hour = currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours();
    var min = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
    var sec = currentDate.getSeconds() < 10 ? "0" + currentDate.getSeconds() : currentDate.getSeconds();
    var date = year + "/" + month + "/" + day;
    var time = hour + ":" + min + ":" + sec
    var dateSend = [date, time]
    return dateSend;

}
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
        }, 10000);
        setInterval(function () {
            let dateTime = getCurrentTime();
            let date = dateTime[0];
            var datavdkA = daoSensor.getLogTimeByDate("vdka", date);
            var datavdkB = daoSensor.getLogTimeByDate("vdkb", date);
            datavdkA.then(function (data, err) {
                let length = data.length;
                data.forEach(e => {
                    if (e.id == length) {
                        let dataSend = {
                            content: "checkTime",
                            timein: e.timein,
                            timeout: e.timeout,
                        }
                        dataSend = JSON.stringify(dataSend);
                        res.write("id: vdkA\n");
                        res.write("data: " + dataSend + "\n\n");
                    }
                });

            }).catch(function (err) {
                if (err) throw err;
            });
            datavdkB.then(function (data, err) {
                let length = data.length;
                data.forEach(e => {
                    if (e.id == length) {
                        let dataSend = {
                            content: "checkTime",
                            timein: e.timein,
                            timeout: e.timeout,
                        }
                        dataSend = JSON.stringify(dataSend);
                        res.write("id: vdkB\n");
                        res.write("data: " + dataSend + "\n\n");
                    }
                });
            }).catch(function (err) {
                if (err) throw err;
            });
        }, 2000);
        client.subscribe(topicRequestAll, function (err) {
            if (err) throw err;
        });
        client.subscribe(clientManager, function (err) {
            if (err) throw err;
        });
        client.subscribe(topicManager, function (err) {
            if (err) throw err;
        });
        client.subscribe(vdkARes, function (err) {
            if (err) throw err;
        });
        client.subscribe(vdkBRes, function (err) {
            if (err) throw err;
        });
        client.subscribe(topicEmergency, function (err) {
            if (err) throw err;
        });
        client.on("message", function (topic, msg, pkt) {
            var topicArr = topic.split("/");
            console.log(topic);
            console.log(msg.toString());
            //Topic của thiết bị
            if (topicArr[1] == "DEVICES") {
                if (topicArr[2] == "VDKA") {
                    if (topicArr[3] == "SENSOR") {
                        var dataSend = {
                            content: "checkSensor",
                            status: 1
                        }
                        dataSend = JSON.stringify(dataSend);
                        res.write('id: vdkA\n');
                        res.write('data: ' + dataSend + "\n\n");
                    }
                }
                if (topicArr[2] == "VDKB") {
                    if (topicArr[3] == "SENSOR") {
                        var dataSend = {
                            content: "checkSensor",
                            status: 1
                        }
                        dataSend = JSON.stringify(dataSend);
                        res.write('id: vdkB\n');
                        res.write('data: ' + dataSend + "\n\n");
                    }
                }
            }

            //Topic của phần điều khiển
            if (topicArr[1] === "CONTROLLER") {
                if (topicArr[2] === "VDKA") {
                    if (topicArr[3] === "RESPONSE") {
                        if (topicArr[4] === "LED") {
                            if (checkJson(msg.toString())) {
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
                            else {
                                console.log("Json khong hop lệ ở topic led response vkdA", msg.toString());
                            }

                        }
                    }
                    // Nhận được tín hiệu từ VKDA xử lý và chuyển cho VDKB
                    if (topicArr[3] == "REQUEST") {
                        if (topicArr[4] == "WORK") {
                            if (checkJson(msg.toString())) {
                                var msgGet = JSON.parse(msg);
                                var status = msgGet.status;
                                var data = {
                                    content: "vdkWork",
                                    status: status,
                                    countJobWork: countJobWork
                                }
                                if (status === "0000") {
                                    statusvdkA = "0000";
                                }
                                if (status === "0001") {
                                    client.publish(vdkBWork, "0001", { qos: 1, retain: true }, function (err) {
                                        if (err) throw err
                                    });
                                    data = JSON.stringify(data);
                                    res.write("id: vdkA\n");
                                    res.write("data: " + data + "\n\n");
                                }
                                else if (status === "0111") {
                                    client.publish(vdkBWork, "0111", { qos: 1, retain: true }, function (err) {
                                        if (err) throw err
                                    });
                                    data = JSON.stringify(data);
                                    res.write("id: vdkA\n");
                                    res.write("data: " + data + "\n\n");
                                }
                            }
                            else {
                                console.log("Json khong hop lệ ở topic resquest ở VDKA", msg.toString());
                            }
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
                    // Nhận được tín hiệu từ VKDA xử lý và chuyển cho VDKB
                    if (topicArr[3] == "REQUEST") {
                        if (topicArr[4] == "WORK") {
                            if (checkJson(msg.toString())) {
                                console.log(msg.toString);
                                var msgGet = JSON.parse(msg);
                                var status = (msgGet.status);
                                console.log("status là :", status);
                                var data = {
                                    content: "vdkWork",
                                    status: status,
                                    countJobWork: countJobWork
                                }
                                if (status == "0000") {
                                    statusvdkB = "0000";
                                }
                                if (status === "0011") {
                                    client.publish(vdkAWork, "0011", { qos: 1, retain: true }, function (err) {
                                        if (err) throw err
                                    });
                                    data = JSON.stringify(data);
                                    res.write("id: vdkB\n");
                                    res.write("data: " + data + "\n\n");
                                }
                                else if (status === "1111") {
                                    countJobWork++;
                                    client.publish(vdkAWork, "0000", { qos: 1, retain: true }, function (err) {
                                        if (err) throw err
                                    });
                                    client.publish(vdkBWork, "0000", { qos: 1, retain: true }, function (err) {
                                        if (err) throw err
                                    });
                                    data = JSON.stringify(data);
                                    res.write("id: vdkB\n");
                                    res.write("data: " + data + "\n\n");
                                }
                            }
                            else {
                                console.log("Json khong hop lệ ở topic resquest ở VDKB", msg.toString());
                            }
                        }
                    }
                }
                console.log("statusvdkA= ", statusvdkA);
                console.log("statusvdkB= ", statusvdkB);
                if (statusvdkA == "0000" && statusvdkB == "0000") {
                    var data = {
                        content: "vdkWork",
                        status: "0000"
                    };
                    data = JSON.stringify(data);
                    res.write("id: allVdk\n");
                    res.write("data: " + data + "\n\n");
                    statusvdkA = "";
                    statusvdkB = "";
                    client.publish(vdkAWork, "2222", { qos: 1, retain: true }, function (err) {
                        if (err) throw err
                    });
                }
            }
            //Topic của phần giám sát thiết bị và lưu thời gian thiết bị bắt đầu hoạt động
            if (topicArr[1] == "CLIENT") {
                var msgGet = JSON.parse(msg);
                var status = Number(msgGet.status);
                var dataSend = {
                    content: "supervision",
                    id: msgGet.id,
                    status: status,
                }
                dataSend = JSON.stringify(dataSend);
                if (topicArr[2] == "VDKA") {
                    if (status == 1) {
                        var dateTime = getCurrentTime();
                        var date = dateTime[0];
                        var timein = dateTime[1];
                        logTimeA.date = date;
                        logTimeA.timein = timein;
                        daoSensor.logTime("vdka", logTimeA);
                    }
                    else {
                        if (logTimeA.timein) {
                            let dateTime = getCurrentTime();
                            logTimeA.timeout = dateTime[1];
                            daoSensor.updateLogTime("vdka", logTimeA.timein, logTimeA.timeout);
                            logTimeA.timein = null;
                            logTimeA.date = null;
                            logTimeA.timeout = null;
                        }
                    }
                    res.write("id: vdkA\n");
                    res.write("data: " + dataSend + "\n\n");
                }
                if (topicArr[2] == "VDKB") {
                    if (status == 1) {
                        var dateTime = getCurrentTime();
                        var date = dateTime[0];
                        var timein = dateTime[1];
                        logTimeB.date = date;
                        logTimeB.timein = timein;
                        daoSensor.logTime("vdkb", logTimeB);
                    }
                    if (status == 0) {
                        if (logTimeB.timein) {
                            let dateTime = getCurrentTime();
                            logTimeB.timeout = dateTime[1];
                            daoSensor.updateLogTime("vdkb", logTimeB.timein, logTimeB.timeout);
                            logTimeB.timein = null;
                            logTimeB.date = null;
                            logTimeB.timeout = null;
                        }
                    }
                    res.write("id: vdkB\n");
                    res.write("data: " + dataSend + "\n\n");
                }
                if (topicArr[2] == "WEBAPP") {
                    res.write("id: webApp\n");
                    res.write("data: " + dataSend + "\n\n");
                }
                if (topicArr[2] == "MOBIAPP") {
                    res.write("id: mobiApp\n");
                    res.write("data: " + dataSend + "\n\n");
                }
            }
            // Topic của phần thông báo
            if (topicArr[1] == "EMERGENCE") {
                if (topicArr[2] == "VDKA") {
                    msg = JSON.parse(msg);
                    if (msg.code = "ERRSSDHT11OFF") {
                        var dataSend = {
                            content: "err",
                            errCode: "ERRSSDHT11OFF"
                        }
                        dataSend = JSON.stringify(dataSend);
                        res.write("id: " + "vdkA\n");
                        res.write("data: " + dataSend + "\n\n");
                    }
                };
                if (topicArr[2] == "VDKB") {
                    msg = JSON.parse(msg);
                    if (msg.code = "ERRSSDHT11OFF") {
                        var dataSend = {
                            content: "err",
                            errCode: "ERRSSDHT11OFF"
                        }
                        dataSend = JSON.stringify(dataSend);
                        res.write("id: " + "vdkB\n");
                        res.write("data: " + dataSend + "\n\n");
                    }
                }
            }
        });
        router.post("/", function (req, res, next) {
            var data = {
                id: req.body.id,
                status: req.body.status
            };
            res.status(200).json({
                msg: "Ok"
            });
            var id = data.id;
            var status = Number(data.status);
            if (id === "vdkA") {
                if (status === 1) {
                    client.publish(vdkALedOn, "1", { qos: 2, retain: true }, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                }
                else if (status === 0) {
                    client.publish(vdkALedOff, "0", { qos: 2, retain: true }, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
            if (id === "vdkB") {
                if (status === 1) {
                    client.publish(vdkBLedOn, "1", { qos: 2, retain: true }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                else if (status === 0) {
                    client.publish(vdkBLedOff, "0", { qos: 2, retain: true }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
            if (id == "vdkReset") {
                console.log("Complet get data reset");
                client.publish(vdkAWork, "0000", { qos: 1, retain: true }, function (err) {
                    if (err) throw err
                });
                client.publish(vdkBWork, "0000", { qos: 1, retain: true }, function (err) {
                    if (err) throw err
                });
            }
        });
    });
});
module.exports = router;
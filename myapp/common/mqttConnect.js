var mqtt = require('mqtt');
var config = require('config');
var options={
    "port": 16543,
    "host": "mqtt://m15.cloudmqtt.com",
    "username": "computer_controller",
    "password": "1234",
    "keepalive": 60,
    "clientId": "mqttclient03",
    "reconnectPeriod": 1000,
    "protocolId": "MQIsdp",
    "protocolVersion": 3,
    "clean": false,
    "encoding": "utf8",
    "queueQoSZero":false,
    "clean":false,
    "connectTimeout":30000
}
var client =mqtt.connect(config.get("mqtt_config.mqtt_option.host"), options);

module.exports = client;
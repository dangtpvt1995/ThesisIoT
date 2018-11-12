var mqtt = require('mqtt');
var config = require('config');
var client =mqtt.connect(config.get("mqtt_config.mqtt_option.host"), config.get("mqtt_config.mqtt_option"));

module.exports = client;
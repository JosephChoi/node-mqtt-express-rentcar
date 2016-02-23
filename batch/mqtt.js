var mqtt = require('mqtt');

var CarDataBase = require('../db/cardb').CarDataBase;
var carDatabase = new CarDataBase('localhost', 27017);

MqttBatch = function (host, port) {
    if(!host){
        host = 'mqtt://test.mosquitto.org';
    }

    if(!port){
        port = 0;
    }
    
    this.mqttClient = mqtt.connect(host);
    
    this.mqttClient.on('connect', function(){
        this.subscribe('citycar/#');
        this.publish('citycar/KR/SEOUL/FKI/1', 'Hello mqtt this is joseph');
        console.log('connected mqtt');    
    });
    
    this.mqttClient.on('message', function(topic, message){
        var topicArray = topic.split('/');
        console.log(topic.toString());
        console.log('topic depth > ' + topicArray.length);
        console.log(message.toString());
        if(topicArray.length === 5){
            try{
                var mqttMessageObj = JSON.parse(message);
                console.log(mqttMessageObj.carId);
                console.log(mqttMessageObj.type);
                console.log(mqttMessageObj.content.doorLock);
                
                if(mqttMessageObj.type && mqttMessageObj.type === 'status'){
                    carDatabase.addStatusToCar(mqttMessageObj.carId, mqttMessageObj.content, function(error, result){
                        console.log(result);
                    });    
                }
            }catch(e){
                
            }
            
        }
    });
}

//test command
//mqtt pub -t citycar/KR/SEOUL/FKI/2 -h "test.mosquitto.org" -m "{\"carId\":\"55efde04212f4af02551d097\",\"type\":\"status\", \"content\":{\"doorLock\":\"open\"}}

module.exports.MqttBatch = MqttBatch;
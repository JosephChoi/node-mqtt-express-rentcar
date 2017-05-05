$(document).ready(function(){
    
//    var mqttClient = new Paho.MQTT.Client('test.mosquitto.org', 8080, "clientId");
//    Anonymous clients are no longer accidently disconnected from the broker after a SIGHUP
//    http://mosquitto.org/
    // var mqttClient = new Paho.MQTT.Client('test.mosquitto.org', 8080, "");
    var mqttClient = new Paho.MQTT.Client('broker.hivemq.com', 8000, "");
    
    var receiveMqttMessage = function(message){
        
    };
    
    function deleteCarInformation(carId){
        
        $.ajax({
            method: "POST",
            url: "/rest/cars/" + carId,
            contentType: "application/json",
            data: JSON.stringify({ 
                car: {
                    isDeleted: true
                }
            }),
            success: function(data, textStatus, jqXHR){
                console.log(data);
                alert('deleted');
                
                $('tr').each(function(index, element){
                    if($(this).attr('data-car-id') === carId){
                        $(this).slideUp();
                    }
                });
                
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(errorThrown);
            }
        });
    }
    
    function commandCarDoor(isCommandOpen, carId, countryCd, locationCd, branchCd, carSeqNo){
        var topic = 'citycar/' + 
            countryCd + '/' +
            locationCd + '/' +
            branchCd + '/' +
            carSeqNo;

        var commandObj = {
            carId: carId,
            type: 'command',
            content:{
                doorLock: (isCommandOpen ? 'open' : 'close')
            }
        };
        
        var payloadString = JSON.stringify(commandObj);

        mqttClient.send(topic, payloadString);
    }
    
    function connectMqttBroker(){
        mqttClient.connect({onSuccess: function(){
            console.log('onConnect');
            mqttClient.subscribe('citycar/#');
        }});
    }
    
    mqttClient.onMessageArrived = function(message){
        var topic = message.destinationName;
        var receivedMessage = message.payloadString;
        var topicArray = topic.split('/');
        console.log(topic.toString());
        console.log('topic depth >> ' + topicArray.length);
        console.log(message.toString());

        try{
            var mqttMessageObj = JSON.parse(receivedMessage);
            var carId = mqttMessageObj.carId;
            console.log(mqttMessageObj.carId);
            console.log(mqttMessageObj.type);
            console.log(mqttMessageObj.content.doorLock);

            var topicCountryCd = '';
            var topicLocationCd = '';
            var topicBranchCd = '';
            var topicCarSeqNo = '';
            if(topicArray.length === 5){
                topicCountryCd = topicArray[1];
                topicLocationCd = topicArray[2];
                topicBranchCd = topicArray[3];
                topicCarSeqNo = topicArray[4];
            }

            if(mqttMessageObj.type && mqttMessageObj.type === 'status'){
                $('tr').each(function(index, element){
                    if($(this).attr('data-car-id') === carId && 
                       $(this).attr('data-country-cd') === topicCountryCd && $(this).attr('data-location-cd') === topicLocationCd &&
                       $(this).attr('data-branch-cd') === topicBranchCd && $(this).attr('data-car-seq-no') === topicCarSeqNo){
                        $(this).children('.doorStatus').text(mqttMessageObj.content.doorLock);
                    }
                });    
            }
        }catch(e){

        }    
    };
    
    mqttClient.onConnectionLost = function(responseObject){
        if(responseObject.errorCode !== 0){
            console.log('onConnectionLost >> ' + responseObject.errorMessage);
            connectMqttBroker();
        }
    };
    
   
    
    $(".lnkDeleteCar").on('click', function(e){
        var carId = $(e.currentTarget).parents('tr').attr('data-car-id');
        deleteCarInformation(carId);
    });

    $(".lnkOpenDoor").on('click', function(e){
        var carId = $(e.currentTarget).parents('tr').attr('data-car-id');
        var countryCd = $(e.currentTarget).parents('tr').attr('data-country-cd');
        var locationCd = $(e.currentTarget).parents('tr').attr('data-location-cd');
        var branchCd = $(e.currentTarget).parents('tr').attr('data-branch-cd');
        var carSeqNo = $(e.currentTarget).parents('tr').attr('data-car-seq-no');
        commandCarDoor(true, carId, countryCd, locationCd, branchCd, carSeqNo);
    });

    $(".lnkCloseDoor").on('click', function(e){
        var carId = $(e.currentTarget).parents('tr').attr('data-car-id');
        var countryCd = $(e.currentTarget).parents('tr').attr('data-country-cd');
        var locationCd = $(e.currentTarget).parents('tr').attr('data-location-cd');
        var branchCd = $(e.currentTarget).parents('tr').attr('data-branch-cd');
        var carSeqNo = $(e.currentTarget).parents('tr').attr('data-car-seq-no');
        commandCarDoor(false, carId, countryCd, locationCd, branchCd, carSeqNo);
    });
    
    $("#btnNew").on('click', function(e){
        document.location = '/cars/setting/';
    });
    
    connectMqttBroker();

});
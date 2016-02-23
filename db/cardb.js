var Db = require('mongodb').Db;
var Connection = require ('mongodb').Connection ;
var Server = require ('mongodb').Server;
var BSON = require ('mongodb').BSON;
var ObjectID = require ('mongodb').ObjectID;


CarDataBase = function (host, port) {
    if(!host){
        host = 'localhost';
    }
    
    if(!port){
        port = 27017;
    }
    
    this.db = new Db('citycar', new Server(host, port, {auto_reconnect: true}), {safe: false});
    this.db.open(function(error){
        if(!error){
            console.log ("We are connected");
        }else{
            console.log (error);
        }
    });
}


CarDataBase.prototype.getCollection = function(callback){
    this.db.collection('cars', function(error, carInfoCollection){
        if(error){
            console.log(error);
            callback(error);
        }else{
            callback(null, carInfoCollection);
        }
    });
};

CarDataBase.prototype.findAll = function(callback){
    
    this.getCollection(function(error, carInfoCollection){
        if(error){
            callback(error);
        }else{
            carInfoCollection.find({isDeleted:{$ne: true}}).toArray(function(error, cars){
                if(error){
                    callback(error);
                }else{
                    callback(null, cars);
                }
            });
        }
    });
};


CarDataBase.prototype.findById = function(carId, callback){
    
    this.getCollection(function(error, carInfoCollection) {
        if(error){
            callback(error);
        }else{
            carInfoCollection.findOne({_id: ObjectID.createFromHexString(carId)}, function(error, car) {
                if(error){
                    callback(error);
                }else{
                    callback(null, car);
                }
            });
            
        }
    });
    
};


CarDataBase.prototype.addStatusToCar = function(carId, status, callback){
    this.getCollection(function(error, carInfoCollection){
        if(error){
            callback(error);
        }else{            
            status.created_at = new Date();
            carInfoCollection.update({_id: ObjectID.createFromHexString(carId)},
                                     {"$set": {lastModified_at: status.created_at},
                                      "$push": {status: status}},
                                     function (error, result){
                if(error){
                    callback(error);
                }else{
                    callback (null, result);
                }
            });
        }
    });
}

CarDataBase.prototype.save = function(cars, callback){
    this.getCollection(function(error, carInfoCollection){
        if(error){
            callback(error);
        }else{
            if(typeof(cars.length) == "undefined"){
                cars = [cars];
            }

            for (var inx = 0; inx < cars.length; inx++) {
                var car = cars[inx];
                car.created_at = new Date();
                car.lastModified_at = car.created_at;
                car.isDeleted = false;

                if (car.status == undefined){
                    car.status = [];
                }

                for (var jnx = 0; jnx < car.status.length; jnx++) {
                    car.status[jnx].created_at = new Date();
                }
            }

            carInfoCollection.insert(cars, {safe: true}, function(error, result) {
                callback(null, result);
            });
        }
    });
};

CarDataBase.prototype.update = function(carId, car, callback){
    this.getCollection(function(error, carInfoCollection){
        if(error){
            callback(error);
        }else{
            var setCarObject = {
                lastModified_at: new Date()
            };
            
            if(car.carRegNo){
                setCarObject.carRegNo = car.carRegNo;
            }
            if(car.countryCd){
                setCarObject.countryCd = car.countryCd;
            }
            if(car.locationCd){
                setCarObject.locationCd = car.locationCd;
            }
            if(car.branchCd){
                setCarObject.branchCd = car.branchCd;
            }
            if(car.carSeqNo){
                setCarObject.carSeqNo = car.carSeqNo;
            }
            if(car.isDeleted){
                setCarObject.isDeleted = car.isDeleted;
            }
            
            carInfoCollection.update({_id: ObjectID.createFromHexString(carId)},
                                     {"$set": setCarObject},
                                     function (error, result){
                if(error){
                    callback(error);
                }else{
                    callback (null, result);
                }
            });
        }
    });
};

module.exports.CarDataBase = CarDataBase;
var Db = require('mongodb').Db;
var Connection = require ('mongodb').Connection ;
var Server = require ('mongodb').Server;
var BSON = require ('mongodb').BSON;
var ObjectID = require ('mongodb').ObjectID;


CountryDataBase = function (host, port) {
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


CountryDataBase.prototype.getCollection = function(callback){
    this.db.collection('countries', function(error, countryCollection){
        if(error){
            console.log(error);
            callback(error);
        }else{
            callback(null, countryCollection);
        }
    });
};

CountryDataBase.prototype.findAll = function(callback){

    this.getCollection(function(error, countryCollection){
        if(error){
            callback(error);
        }else{
            countryCollection.find({isDeleted:{$ne: true}}).toArray(function(error, countryCodes){
                if(error){
                    callback(error);
                }else{
                    callback(null, countryCodes);
                }
            });
        }
    });
};


CountryDataBase.prototype.findById = function(countryId, callback){

    this.getCollection(function(error, countryCollection) {
        if(error){
            callback(error);
        }else{
            countryCollection.findOne({_id: ObjectID.createFromHexString(countryId)}, function(error, countryCode) {
                if(error){
                    callback(error);
                }else{
                    callback(null, countryCode);
                }
            });

        }
    });

};


CountryDataBase.prototype.save = function(countryCodes, callback){
    this.getCollection(function(error, countryCollection){
        if(error){
            callback(error);
        }else{
            if(typeof(countryCodes.length) == "undefined"){
                countryCodes = [countryCodes];
            }

            for (var inx = 0; inx < countryCodes.length; inx++) {
                var countryCode = countryCodes[inx];
                countryCode.created_at = new Date();
                countryCode.lastModified_at = countryCode.created_at;
                countryCode.isDeleted = false;
                countryCode.locations = [];
            }

            countryCollection.insert(countryCodes, {safe: true}, function(error, result) {
                console.log('category saved');
                callback(null, result);
            });
        }
    });
};

CountryDataBase.prototype.update = function(countryId, countryCode, callback){
    this.getCollection(function(error, countryCollection){
        if(error){
            callback(error);
        }else{
            var CountryCodeObj = {
                lastModified_at: new Date()
            };

            if(countryCode.countryCd){
                CountryCodeObj.countryCd = countryCode.countryCd;
            }
            if(countryCode.countryNm){
                CountryCodeObj.countryNm = countryCode.countryNm;
            }
            if(countryCode.countryDesc){
                CountryCodeObj.countryDesc = countryCode.countryDesc;
            }
            if(countryCode.isDeleted){
                CountryCodeObj.isDeleted = countryCode.isDeleted;
            }
            
            countryCollection.update({_id: ObjectID.createFromHexString(countryId)},
                                        {"$set": CountryCodeObj},
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

CountryDataBase.prototype.addLocationToCountry = function(countryId, locationCode, callback){
    this.getCollection(function(error, countryCollection){
        if(error){
            callback(error);
        }else{
            locationCode._id = new ObjectID();
            locationCode.created_at = new Date();
            locationCode.lastModified_at = locationCode.created_at;

            countryCollection.update({_id: ObjectID.createFromHexString(countryId)},
                                     {"$set": {lastModified_at: locationCode.created_at},
                                     "$push": {locations: locationCode}},
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


module.exports.CountryDataBase = CountryDataBase;
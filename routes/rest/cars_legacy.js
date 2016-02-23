var express = require('express');
var mongo = require('mongodb');

var router = express.Router();

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('citycar', server);


db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'citycar' database");
    }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
    db.collection('CAR_INFO').find().toArray(function(err, items){
        if(err){
            throw err;
        }
        res.json(items);
    });
});

router.post('/', function(req, res, next) {
    var car = [
        {
            CAR_ID: '',
            CAR_REG_NO: '',
            COUNTRY_CD: '',
            LOCATION_CD: '',
            BRANCH_CD: '',
            CAR_SEQ_NO: '',
        }
    ];

    db.collection('CAR_INFO', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {
            res.json({
                result: 'success'
            });
        });
    });
});

router.get('/:carId', function(req, res, next) {
    var carId = (req.params.carId || '');
    if(parseInt(carId) > 100){
        var err = new Error('Overflow car Id');
        err.status = 400;
        throw err;
    }
    
    db.collection('CAR_INFO').find({CAR_ID: carId}).toArray(function(err, items){
        if(err){
            throw err;
        }
        res.json(items);
    });

});






module.exports = router;

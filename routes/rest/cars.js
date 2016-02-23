var express = require('express');
var mongo = require('mongodb');

var CarDataBase = require('../../db/cardb').CarDataBase;
var carDatabase = new CarDataBase('localhost', 27017);

var router = express.Router();




/* GET users listing. */
router.get('/', function(req, res, next) {
    carDatabase.findAll(function(error, cars){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }
        res.json(cars);    
    });
});

router.post('/', function(req, res, next) {
    req.accepts('application/json');
//    var cars = [
//        {
//            carRegNo: '',
//            countryCd: '',
//            locationCd: '',
//            branchCd: '',
//            carSeqNo: '',
//            status: []
//        }
//    ];
    var cars = req.body.cars;
    carDatabase.save(cars, function(error, result){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }
        res.json({
            result: result,
        });
    }); 
});

router.get('/:carId', function(req, res, next) {
    var carId = (req.params.carId || '');

    carDatabase.findById(carId, function(error, car){
        if(error){
            var err2 = new Error(error.toString());
            err2.status = 500;
            throw err2;
        }
        res.json(car);
    });

});

router.post('/:carId', function(req, res, next) {
    req.accepts('application/json');
    var carId = (req.params.carId || '');
    
    var car = req.body.car;
    carDatabase.update(carId, car, function(error, result){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }
        res.json({
            result: result
        });    
    });

});




module.exports = router;

var express = require('express');
var router = express.Router();

var CarDataBase = require('../../db/cardb').CarDataBase;
var carDatabase = new CarDataBase('localhost', 27017);

router.get('/', function(req, res, next) {
    carDatabase.findAll(function(error, cars){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }
        
        var datas = {
            title: 'Car List',
            cars: cars
        };
        
        res.render('cars/carList', datas);
        
    });
});

router.get('/setting', function(req, res, next) {

    var datas = {
        title: 'setting',
        car: {
            carId: '',
            carRegNo: '',
            countryCd: '',
            locationCd: '',
            branchCd: '',
            carSeqNo: '',
            status: []
        }
    };
    res.render('cars/car', datas);
});

router.get('/setting/:carId', function(req, res, next) {
    var carId = (req.params.carId || '');
    carDatabase.findById(carId, function(error, car){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }
        console.log('car >> ' + car);
        var datas = {
            title: 'setting',
            car: car
        };
        res.render('cars/car', datas);
    });
});

router.get('/:carId', function(req, res, next) {
    var carId = (req.params.carId || '');
    carDatabase.findById(carId, function(error, car){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }

        var cars = null;
        if(car && car._id){
            cars = [car];
        }else{
            cars = [];
        }
        var datas = {
            title: 'Car List',
            cars: cars
        };

        res.render('cars/carList', datas);    

    });
});


module.exports = router;

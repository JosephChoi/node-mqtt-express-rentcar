var express = require('express');
var router = express.Router();

var CountryDataBase = require('../../db/countrydb').CountryDataBase;
var countryDataBase = new CountryDataBase('localhost', 27017);

router.get('/', function(req, res, next) {
    
    countryDataBase.findAll(function(error, countryCodes){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }

        var datas = {
            title: 'Country Code List',
            countryCodes: countryCodes
        };
        

        res.render('countries/countryCodeList', datas);    

    });
});

router.get('/setting', function(req, res, next) {

    countryDataBase.findAll(function(error, countryCodes){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }
        console.log('countryCodes >> ' + countryCodes);

        var datas = {
            title: 'setting',
            countryCode: {
                countryCd: '',
                countryNm: '',
                countryDesc: '',
                locations: []
            }
        };
        res.render('countries/countryCode', datas);

    });

});

router.get('/setting/:countryId', function(req, res, next) {
    var countryId = (req.params.countryId || '');
    
    countryDataBase.findById(countryId, function(error, countryCode){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }
        console.log('commonCode >> ' + countryCode);

        var datas = {
            title: 'setting',
            countryCode: countryCode
        };
        res.render('countries/countryCode', datas);
    });
   
});



router.get('/:countryId', function(req, res, next) {
    var countryId = (req.params.countryId || '');
    countryDataBase.findById(countryId, function(error, countryCode){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }

        var countryCodes = null;
        if(countryCode && countryCode._id){
            countryCodes = [countryCode];
        }else{
            countryCodes = [];
        }
        
        var datas = {
            title: 'Country Code List',
            countryCodes: countryCodes
        };


        res.render('countries/countryCodeList', datas);    

    });
});

router.get('/:countryId/locations', function(req, res, next) {
    
    var countryId = (req.params.countryId || '');
    res.json({countryId:countryId, isSetting: false});
//
//    countryDataBase.findById(countryId, function(error, countryCode){
//        if(error){
//            var err = new Error(error.toString());
//            err.status = 500;
//            throw err;
//        }
//        console.log('commonCode >> ' + countryCode);
//
//        var datas = {
//            title: 'setting',
//            countryCode: countryCode
//        };
//        res.render('countries/countryCode', datas);
//    });

});

router.get('/:countryId/locations/:locationId', function(req, res, next) {
    
    var countryId = (req.params.countryId || '');
    var locationId = (req.params.countryId || '');
    res.json({countryId:countryId, locationId: locationId});

//    countryDataBase.findById(countryId, function(error, countryCode){
//        if(error){
//            var err = new Error(error.toString());
//            err.status = 500;
//            throw err;
//        }
//        console.log('commonCode >> ' + countryCode);
//
//        var datas = {
//            title: 'setting',
//            countryCode: countryCode
//        };
//        res.render('countries/countryCode', datas);
//    });

});


module.exports = router;

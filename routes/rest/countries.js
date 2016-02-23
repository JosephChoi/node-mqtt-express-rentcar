var express = require('express');
var mongo = require('mongodb');

var CountryDataBase = require('../../db/countrydb').CountryDataBase;
var countryDatabase = new CountryDataBase('localhost', 27017);

var router = express.Router();




/* GET users listing. */
router.get('/', function(req, res, next) {
    countryDatabase.findAll(function(error, countryCodes){
        if(error){
            var err = new Error(error.toString());
            err.status = 500;
            throw err;
        }
        res.json(countryCodes);    
    });
});

router.post('/', function(req, res, next) {
    req.accepts('application/json');
    var countryCodes = req.body.countryCodes;
    countryDatabase.save(countryCodes, function(error, result){
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


router.get('/:countryId', function(req, res, next) {
    var countryId = (req.params.countryId || '');

    countryDatabase.findById(countryId, function(error, countryCode){
        if(error){
            var err2 = new Error(error.toString());
            err2.status = 500;
            throw err2;
        }
        res.json(countryCode);
    });

});

router.post('/:countryId', function(req, res, next) {
    req.accepts('application/json');
    var countryId = (req.params.countryId || '');

    var countryCode = req.body.countryCode;
    countryDatabase.update(countryId, countryCode, function(error, result){
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

router.post('/:countryId/location', function(req, res, next) {
    req.accepts('application/json');
    var countryId = (req.params.countryId || '');
    var locationCode = req.body.locationCode;
    
    countryDatabase.addLocationToCountry(countryId, locationCode, function(error, result){
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



//        "/countries/" + $("#countryId").val() + "/location/setting";


module.exports = router;

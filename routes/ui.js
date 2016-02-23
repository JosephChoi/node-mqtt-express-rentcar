var express = require('express');
var router = express.Router();

var index = require('./index');
var cars = require('./ui/cars');
var countries = require('./ui/countries');

router.use('/', index);
router.use('/cars', cars);
router.use('/countries', countries);

module.exports = router;

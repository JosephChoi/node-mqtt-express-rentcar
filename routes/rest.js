var express = require('express');

var cars = require('./rest/cars');
var countries = require('./rest/countries');

var router = express.Router();

router.use('/cars', cars);
router.use('/countries', countries);

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('rest api');
});


//에러 메시지 기본 response code
//추가 에러메시지 관련 학습 => http://en.wikipedia.org/wiki/Http_error_codes
//200 성공
//400 Bad Request - field validation 실패시
//401 Unauthorized - API 인증,인가 실패
//404 Not found - 해당 리소스가 없음
//500 Internal Server Error - 서버 에러

router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;    
    next(err);
});

router.use(function(err, req, res, next) {
    res.json('error', {
        message: err.message,
        error: err
    });
});

module.exports = router;

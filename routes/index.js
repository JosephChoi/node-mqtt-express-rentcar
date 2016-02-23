var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var datas = {
        title: 'City Car'
    };
    res.render('index', datas);
});

module.exports = router;

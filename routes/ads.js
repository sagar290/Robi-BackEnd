var express = require('express');
var router = express.Router();
var inserter = require('../config/dbinserter');
var moment = require('moment');

router.use('/', isLoggedIn);
router.use('/', function(req, res, next) {
    var data = {
        title: 'Training Backend',
        logofirst: '10',
        logosecondmin: 'MS',
        logosecond: 'MinuteSchool',
        user: req.user
    };

    req.data = data;
    next();
});

router.get('/', function(req, res) {

    res.render('backend/ads', req.data);
});

router.post('/', function(req, res) {
    var htmldata = req.body.html;
    inserter.model = 'ads';
    var data = {
        region: req.user.region,
        html: htmldata,
        date: moment().format()
    }
    inserter.insert(data);
    res.send("Success: sent to users of region " + req.user.region);
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;

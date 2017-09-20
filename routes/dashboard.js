var express = require('express');
var router = express.Router();

router.use('/', isLoggedIn);
router.use('/', function(req, res, next) {
    var data = {
        title: 'Training Backend',
        logofirst: '10',
        logosecondmin: 'MS',
        logosecond: 'MinuteSchool',
        username: 'Rashed Doha',
        user: req.user
    };

    req.data = data;
    next();
})

/* GET home page. */
router.get('/', function(req, res) {
  res.render('backend/dashboard', req.data);

});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;

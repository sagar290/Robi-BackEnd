var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn, function(req, res) {
  var data = {
      title: 'Training Backend',
      logofirst: '10',
      logosecondmin: 'MS',
      logosecond: 'MinuteSchool',
      username: 'Rashed Doha',
      user: req.user
  }
  res.render('dashboard/index', data);

});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;

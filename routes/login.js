var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {message: req.flash('loginMessage')});

});

router.post('/', passport.authenticate('local-login', {
    successRedirect: '/analytics',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;

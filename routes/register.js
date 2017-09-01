var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', {message: req.flash('signupMessage')});

});

router.post('/', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/register',
    failureFlash: true
}));


module.exports = router;

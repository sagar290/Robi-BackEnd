var express = require('express');
var router = express.Router();
var passport = require('passport');
var searchDb = require('../config/dbquery');

/* GET home page. */
router.get('/', function(req, res) {
  var regionPromise = searchDb.findAllRegions();
    regionPromise.then(function(regions) {
        var data = {
            regions: regions,
            message: req.flash('signupMessage')
        }
        res.render('register', data);
  });


});

router.post('/', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/register',
    failureFlash: true
}));


module.exports = router;

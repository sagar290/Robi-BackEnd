var express = require('express');
var router = express.Router();
var inserter = require('../libs/dbinserter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('multiregister/index');

});

router.post('/', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;

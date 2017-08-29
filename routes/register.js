var express = require('express');
var router = express.Router();
var inserter = require('../libs/dbinserter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register/index');

});

router.post('/', function(req, res, next) {
    inserter.model = 'user',
    inserter.insert(req.body);
    res.redirect('/');
});

module.exports = router;

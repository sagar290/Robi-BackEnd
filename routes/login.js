var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/index');

});

router.post('/', function(req, res, next) {
    res.send('Logged In!');
});

module.exports = router;

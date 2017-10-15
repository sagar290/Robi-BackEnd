var express = require('express');
var router = express.Router();
var xlsx   = require('node-xlsx');
var multiparty = require('connect-multiparty')();
var inserter = require('../config/dbinserter');
var Region = require('../models/region');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('regionentry', {message: req.flash('regionEntryMessage')});

});

router.post('/', multiparty, function(req, res, next) {
    var file = req.files.region_file;
    var obj = xlsx.parse(file.path);
    var sheet = obj[0];
    var users = [];
    sheet.data.forEach(function(row) {

        process.nextTick(function() {
            Region.findOne({
                "region_name": row[0]
            }, function(err, region) {
                if(!region) {
                    var data = {
                        region_name: row[0],
                        population: 0
                    };

                    inserter.model = 'region';
                    inserter.insert(data);
                }
            });
        });

    });

    res.redirect('/');
});


module.exports = router;

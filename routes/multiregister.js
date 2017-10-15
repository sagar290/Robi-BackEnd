var express = require('express');
var router = express.Router();
var xlsx   = require('node-xlsx');
var multiparty = require('connect-multiparty')();
var inserter = require('../config/dbinserter');
var User = require('../models/users');
var Region = require('../models/region');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('multiregister', {message: req.flash('multiRegMessage')});

});

router.post('/', multiparty, function(req, res, next) {
    var file = req.files.user_file;
    var obj = xlsx.parse(file.path);
    var sheet = obj[0];
    var users = [];
    sheet.data.forEach(function(row) {

        process.nextTick(function() {
            User.findOne({
                "email": row[1]
            }, function(err, user) {
                if(!user) {
                    var data = {
                        full_name: row[0],
                        email: row[1],
                        password: row[2]+'',
                        region: row[3],
                        access: row[4]
                    };

                    inserter.model = 'user';
                    inserter.insert(data);

                    Region.findOne({
                        "region_name": row[3]
                    }, function(err, region) {
                        if(!region) {
                            var data = {
                                region_name: row[3],
                                population: 0
                            };

                            inserter.model = 'region';
                            inserter.insert(data);
                        }
                        
                    });
                }
            });
        });

    });

    res.redirect('/');
});


module.exports = router;

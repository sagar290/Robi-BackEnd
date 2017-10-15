var express = require('express');
var router = express.Router();
var searchDb = require('../config/dbquery');

router.use('/', isLoggedIn);
router.use('/', function(req, res, next) {
    var coursesPromise = searchDb.findCoursesInRegion(req.user.region);
    coursesPromise.then(function(courses) {
        var data = {
            title: 'Training Backend',
            logofirst: '10',
            logosecondmin: 'MS',
            logosecond: 'MinuteSchool',
            courses: courses,
            user: req.user
        };

        req.data = data;
        next();
    });

});

router.get('/', function(req, res) {
    var regionPromise = searchDb.findAllRegions();
    regionPromise.then(function(regions) {
        req.data.regions = regions;
        var usersPromise = searchDb.findUsersInRegion(req.user.region);
        usersPromise.then(function(users) {
            var coursesPromise = searchDb.findCoursesInRegion(req.user.region);
            coursesPromise.then(function(courses) {
                req.data.courses = courses;
                req.data.users = users;
                res.render('backend/analytics', req.data);
            });

        });

    });

});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;

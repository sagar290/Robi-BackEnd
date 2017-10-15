module.exports = {
    listCourses: function() {
        var Course = require('../models/course');
        return Course.find({}, 'course_name', function(error, results) {

        }).exec();
    },
    findCourse: function(name) {
        var Course = require('../models/course');
        return Course.findOne({course_name: name}, function(error, result) {

        }).exec();
    },
    findUser: function(username) {
        var Trainee = require('../models/trainees');
        return Trainee.findOne({username: username}, function(error, result) {

        }).exec();
    },
    findCourseWithId: function(courseid) {
        var Course = require('../models/course');
        return Course.findOne({_id: courseid}, function(error, result) {

        }).exec();
    },
    findCoursesInRegion: function(region) {
        var Course = require('../models/course');
        if(region == 'All') {
            return Course.find({}, function(error, result) {

            }).exec();
        }
        else {
            return Course.find({region: region}, function(error, result) {

            }).exec();
        }

    },
    findUsersInRegion: function(region) {
        var Trainee = require('../models/trainees');
        if(region == 'All') {
            return Trainee.find({}, function(error, result) {

            }).exec();
        }
        else {
            return Trainee.find({region: region}, function(error, result) {

            }).exec();
        }
    },
    findUsersWithCourse: function(course) {
        var Trainee = require('../models/trainees');
        return Trainee.find({courses: {$elemMatch: {course_id: course}}}, function(req, res) {

        }).exec();
    },
    findAllRegions: function() {
        var Region = require('../models/region');
        return Region.find({}, function(req, res) {

        }).exec();
    }
}

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
    }
}

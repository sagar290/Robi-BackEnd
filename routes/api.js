var express = require('express');
var router = express.Router();
var query = require('../config/dbquery');
var Moment = require('moment');
var MomentRange = require('moment-range');

var moment = MomentRange.extendMoment(Moment);

// router.use('/', isLoggedIn);
// router.use('/', function(req, res, next) {
//     var data = {
//         title: 'Training Backend',
//         logofirst: '10',
//         logosecondmin: 'MS',
//         logosecond: 'MinuteSchool',
//         user: req.user
//     };
//
//     req.data = data;
//     next();
// })

/* GET home page. */
router.get('/', function(req, res) {
  res.send('API ENDPOINT');

});

router.get('/users/:region', function(req, res) {
    // Search DB for all users in region
    var usersPromise = query.findUsersInRegion('Dhaka');
    usersPromise.then(function(users) {
        res.send(JSON.stringify(users));
    });
});

router.post('/regions', function(req, res) {
    var startDate = moment(req.body.startDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
    var endDate = moment(req.body.endDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
    var range = moment.range(startDate, endDate);

    if(req.body.iwant == 'avgScores') {
        var data = {};
        var regionPromise = query.findAllRegions();
        regionPromise.then(function(regions) {
            var usersAverageScores = Array.apply(null, Array(regions.length)).map(Number.prototype.valueOf,0);
            data.regions = regions.map(function(region) {
                return region.region_name;
            });
            getUsersInRegions(regions).then(function(allusers) {
                var tally = 0,
                avgScore = 0;
                // var users = allusers.map(function(usersinregion) {
                //     var result = [];
                //     for(var i = 0; i < usersinregion.length; i++) {
                //         result.push(usersinregion[0].username);
                //     }
                //     return result;
                // });
                allusers.forEach(function(usersinregion) {
                    usersinregion.forEach(function(user) {
                        user.courses.forEach(function(course) {
                            var dateUpdated = moment(course.dateUpdated);
                            if(range.contains(dateUpdated)) {
                                var quizlen = course.quizzes.length;
                                console.log('The percentage is: ' + course.quizzes[0].percentage);
                                var totalScore = course.quizzes.reduce((s, v) => s.percentage + v.percentage);
                                console.log('The total score is: ' + totalScore.percentage);
                                avgScore = totalScore.percentage / quizlen;
                                console.log(avgScore);
                            }

                        });
                        console.log(avgScore);
                        console.log(usersAverageScores[tally]);
                        usersAverageScores[tally] += parseInt(avgScore);
                        console.log(usersAverageScores[tally]);
                        avgScore = 0;
                    });
                    console.log(tally);
                    if(usersinregion.length != 0) usersAverageScores[tally] /= usersinregion.length;
                    tally++;
                });
                console.log(usersAverageScores);
                data.users = usersAverageScores;
                res.send(JSON.stringify(data));
            });
        });
    }
    else if(req.body.iwant == 'usersTaken') {
        var courseTally = 0;
        var usersCompleted = 0;
        var courseCompleted = [];
        var data = {};
        var coursesPromise = query.findCoursesInRegion(req.body.region);
        coursesPromise.then(function(courses) {
            data.courses = courses.map(function(course) {
                return course.course_name;
            });
            //console.log(courses);
            getUsersWithCourses(courses).then(function(allusers) {
                var usersInRegionPromise = query.findUsersInRegion(req.body.region);
                usersInRegionPromise.then(function(usersinregion) {
                    var totalUsersInRegion = usersinregion.length;
                    var totalLessons = courses[courseTally].lessons.length;
                    console.log("Total Users in Region: " + totalUsersInRegion);
                    console.log("Total Lessons in Course: " + totalLessons);
                    allusers.forEach(function(userswithcourse) {
                        userswithcourse.forEach(function(user) {
                            user.courses.forEach(function(course) {
                                if(course.course_id == courses[courseTally].id) {
                                    var dateUpdated = moment(course.dateUpdated);
                                    if(range.contains(dateUpdated)) {
                                        console.log("Contains date");
                                        var totalLessons = courses[courseTally].lessons.length;
                                        var lessonsTaken = course.lessons.length;
                                        if(lessonsTaken == totalLessons) {
                                            console.log("Completed a course");
                                            usersCompleted++;
                                        }
                                    }
                                }
                            });
                        });
                        var percentage = (usersCompleted*100)/totalUsersInRegion;
                        courseCompleted.push(percentage);
                        usersCompleted = 0;
                        courseTally++;
                    });
                    data.completed = courseCompleted;
                    res.send(JSON.stringify(data));
                });
            });
        });
        // Get total users in region - DONE
        // for each course in courses
        // look for users who took the course
        // if dateUpdated of course taken falls within range
        // look up number of lessons completed of course
        // loop up length of lessons array of course
        // if they match, increment usersCompleted variable
        // divide userCompleted by total users in region
        // and multiply by 100 to find percentage
        // end of each course loop- add percentage to array of usersCompleted
    }
});

router.post('/user', function(req, res) {
    var startDate = moment(req.body.startDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
    var endDate = moment(req.body.endDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
    var range = moment.range(startDate, endDate);
    var courseTally = 0;
    var totalScore = 0;
    var data = {
        completed: {},
        avgScores: {}
    };
    var username = req.body.user;
    var userPromise = query.findUser(username);
    userPromise.then(function(user) {
        getActualCourses(user.courses).then(function(courses) {
            user.courses.forEach(function(course) {
                var dateUpdated = moment(course.dateUpdated);
                if(range.contains(dateUpdated)) {
                    course.quizzes.forEach(function(quiz) {
                        totalScore += quiz.percentage;
                    });
                    var lessonsCompleted = course.lessons.length;
                    var totalLessons = courses[courseTally].lessons.length;

                    data.completed[course.course_id] = (lessonsCompleted*100)/totalLessons;
                    data.avgScores[course.course_id] = totalScore / lessonsCompleted;
                }


            });

            res.send(JSON.stringify(data));
        });
    });

    // look for user with username
    // retrieve array of actual courses object corresponding to user taken courses

    // loop through the quizzes of the user taken course
    // sum up the percentages
    // look up number of lessons completed of course
    // divide the sum by the length of the number of lessons completed to get average quiz score
    // look up length of lessons array of actual course object
    // divide the first by the second and multiply by 100 to get the percentage
    // update length of progress bar with courseid
    // update average quiz score
});

router.post('/users/:region', function(req, res) {
    var startDate = moment(req.body.startDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
    var endDate = moment(req.body.endDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
    var range = moment.range(startDate, endDate);
    var percentages = {};
    var numPeopleTaken = {};
    var days = Array.from(range.by('day'));
    days.forEach(function(day) {
        var val = day.format('lll');
        if(val.charAt(5) == ',') val = val.substr(0,5);
        else val = val.substr(0,6);
        console.log(val);
        percentages[val] = 0;
        numPeopleTaken[val] = 0;
    });
    var course = req.body.course;
    var totalUsers, usersTaken;
    var usersPromise = query.findUsersInRegion(req.params.region);
    usersPromise.then(function(users) {
        totalUsers = users.length;
        var coursePromise = query.findCourse(course);
        coursePromise.then(function(coursefound) {
            var id = coursefound.id;
            var usersWhoTookCourses = query.findUsersWithCourse(id);
            usersWhoTookCourses.then(function(users) {
                if(req.body.iwant == 'percentageTaken') {
                    usersTaken = users.length;
                    console.log(usersTaken);
                    var percentageTaken = usersTaken*100/totalUsers;
                    var percentage = [percentageTaken, 100-percentageTaken];
                    res.send(JSON.stringify(percentage));
                }
                else if(req.body.iwant == 'avgScores') {
                    users.forEach(function(user) {
                        user.courses.forEach(function(course) {
                            if(course.course_id == id) {
                                var dateUpdated = moment(course.dateUpdated);
                                if(range.contains(dateUpdated)) {
                                    var val = dateUpdated.format('lll');
                                    if(val.charAt(5) == ',') val = val.substr(0,5);
                                    else val = val.substr(0,6);
                                    course.quizzes.forEach(function(quiz) {
                                        percentages[val] += quiz.percentage;
                                    });
                                    numPeopleTaken[val] += 1;
                                    percentages[val] /= course.quizzes.length;
                                }
                            }
                        })
                    });

                    for(var key in percentages) {
                        if(percentages[key] > 0) {
                            percentages[key] /= numPeopleTaken[key];
                        }

                    }
                    res.send(JSON.stringify(percentages));

                }

            });
        });
    });
});

function getUsersInRegions(regions) {
    var promises = regions.map(function(region) {
        return query.findUsersInRegion(region.region_name);
    });

    return Promise.all(promises);
}

function getUsersWithCourses(courses) {
    var promises = courses.map(function(course) {
        return query.findUsersWithCourse(course.id);
    });

    return Promise.all(promises);
}

function getActualCourses(courses) {
    var promises = courses.map(function(course) {
        console.log(course.course_id);
        return query.findCourseWithId(course.course_id);
    });

    return Promise.all(promises);
}


// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) return next();
//     res.redirect('/login');
// }

module.exports = router;

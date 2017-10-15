var express = require('express');
var multiparty = require('connect-multiparty')();
var cloudinary = require('../config/cloudinary');
var inserter = require('../config/dbinserter');
var query    = require('../config/dbquery');
var router = express.Router();

router.use('/', isLoggedIn);
router.use('/', function(req, res, next) {
    var data = {
        title: 'Training Backend',
        logofirst: '10',
        logosecondmin: 'MS',
        logosecond: 'MinuteSchool',
        user: req.user
    };

    req.data = data;
    next();
})

/* get course creations. */
router.get('/courses', function(req, res) {
    res.render('backend/content-management', req.data);
});

/* Get Lesson creations */
router.get('/lessons', function(req, res) {
    // get all courses in db in an array
    var coursePromise = query.listCourses();
    coursePromise.then(function(courses){
        req.data.courses = courses;
        res.render('backend/content-management/lessons', req.data);
    });
});



/* Upload Course */
router.post('/course', multiparty, function(req, res) {
    var file = req.files.courseImage;
    cloudinary.v2.uploader.upload(file.path, {upload_preset: 'g8lzeetd'}, function(error, result) {
        if(result) {
            // first create quiz, get quiz id
            var quizTally, optionTally = 0;
            var quiz = {};
            var questions = [],
                answers   = [];
            for(var key in req.body) {
                if(key == 'course_name' || key == 'lesson_name' || key == 'video') {
                    continue;
                }
                if(key.search('question') == 0) {
                    quiz.question = req.body[key];
                }
                else if(key.search('option') == 0) {
                    if(optionTally == 0) {
                        quiz.a = req.body[key];
                        optionTally += 1;
                    }
                    else if(optionTally == 1) {
                        quiz.b = req.body[key];
                        optionTally += 1;
                    }
                    else if(optionTally == 2) {
                        quiz.c = req.body[key];
                        optionTally += 1;
                    }
                    else if(optionTally == 3) {
                        quiz.d = req.body[key];
                        optionTally = 0;
                        questions.push(quiz);
                        quiz = {};
                    }

                }
                else if(key.search('answer') == 0) {
                    answers.push(req.body[key]);
                }

            }
            var quizData = {
                questions: questions,
                answers: answers
            };

            // first enter quizData and get quiz id
            inserter.model = 'quiz';
            inserter.insert(quizData);
            var quizId = inserter.id;

            // create lesson and insert to db
            var lessonData = {
                lesson_name: req.body.lesson_name,
                video_url: req.body.video,
                quiz: quizId
            };

            // insert into db
            inserter.model = 'lesson';
            inserter.insert(lessonData);
            var lessonId = inserter.id;


            // create course
            var lessons = [lessonId];
            var courseData = {
                course_name: req.body.course_name,
                thumbnail_image: result.url,
                region: req.user.region,
                lessons: lessons
            };

            // insert into db
            inserter.model = 'course';
            inserter.insert(courseData);

            // redirect to same page with success message
            var successMessage = 'Successfully created course: ' + courseData.course_name;
            req.data.message = successMessage;
            res.render('backend/content-management', req.data);

        }
        else {
            console.log('Error occured!');
        }
    });

});

/* Upload Lesson */
router.post('/lesson', function(req, res) {
    // first create quiz, get quiz id
    var quizTally, optionTally = 0;
    var quiz = {};
    var questions = [],
        answers   = [];
    for(var key in req.body) {
        if(key == 'lesson_name' || key == 'video') {
            continue;
        }
        if(key.search('question') == 0) {
            quiz.question = req.body[key];
        }
        else if(key.search('option') == 0) {
            if(optionTally == 0) {
                quiz.a = req.body[key];
                optionTally += 1;
            }
            else if(optionTally == 1) {
                quiz.b = req.body[key];
                optionTally += 1;
            }
            else if(optionTally == 2) {
                quiz.c = req.body[key];
                optionTally += 1;
            }
            else if(optionTally == 3) {
                quiz.d = req.body[key];
                optionTally = 0;
                questions.push(quiz);
                quiz = {};
            }

        }
        else if(key.search('answer') == 0) {
            answers.push(req.body[key]);
        }

    }
    var quizData = {
        questions: questions,
        answers: answers
    };

    // first enter quizData and get quiz id
    inserter.model = 'quiz';
    inserter.insert(quizData);
    var quizId = inserter.id;

    // create lesson and insert to db
    var lessonData = {
        lesson_name: req.body.lesson_name,
        video_url: req.body.video,
        quiz: quizId
    };

    // insert into db
    inserter.model = 'lesson';
    inserter.insert(lessonData);
    var lessonId = inserter.id;

    // Find the course selected
    var coursesPromise = query.findCourse(req.body.course);
    coursesPromise.then(function(course) {
        course.lessons.push(lessonId);
        course.save();

        req.data.message = 'Successfully added Lesson ' + lessonData.lesson_name + ' to course ' + course.course_name;
        var coursePromise = query.listCourses();
        coursePromise.then(function(courses){
            req.data.courses = courses;
            res.render('backend/content-management/lessons', req.data);
        });
    });






});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = router;

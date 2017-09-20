module.exports = {
    model: '',
    instance: null,
    id: null,
    insert: function(data){
        if(!this.model) {
            console.log('Missing Model Error');
        }
        else {
            if(this.model == 'user') {
                var bcrypt = require('bcryptjs');
                var User = require('../models/users');
                var newUser = new User();
                this.instance = newUser;
                this.id = newUser._id;
                newUser.full_name = data.full_name;
                newUser.email = data.email;
                newUser.region = data.region;
                newUser.password = newUser.generateHash(data.password);
                newUser.save(function(err) {
                    if(err) console.log(err);
                });
                //newUser.quizzes_completed = [];
            }
            else if(this.model == 'course') {
                var Course = require('../models/course');
                var newCourse = new Course();
                newCourse.course_name = data.course_name;
                newCourse.thumbnail_image = data.thumbnail_image;
                newCourse.lessons = data.lessons;
                newCourse.region = data.region;
                newCourse.save(function(err, course) {
                    if(err) console.log(err);
                });
            }
            else if(this.model == 'lesson') {
                var Lesson = require('../models/lesson');
                var newLesson = new Lesson();
                this.id = newLesson._id;
                newLesson.lesson_name = data.lesson_name;
                newLesson.video_url = data.video_url;
                newLesson.quiz = data.quiz;

                newLesson.save(function(err, lesson) {
                    if(err) console.log(err);
                });
            }
            else if(this.model == 'quiz') {
                // data will have array of question objects
                // and array of answers
                var Quiz = require('../models/quiz');
                var newQuiz = new Quiz();
                this.id = newQuiz._id;
                newQuiz.questions = data.questions;
                newQuiz.answers = data.answers;
                newQuiz.save(function(err, quiz) {
                    if(err) console.log(err);
                });
            }

        }
    }
}

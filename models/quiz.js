var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
    parent_lesson: Schema.ObjectId,
    questions: [
        {
            question: String,
            a: String,
            b: String,
            c: String,
            d: String
        }
    ],
    answers: [String]
});

module.exports = mongoose.model('Quiz', quizSchema);

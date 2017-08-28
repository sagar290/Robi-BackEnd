var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user_name: String,
    password: String,
    quizzes_completed: [{quiz: ObjectId, score: Number}]
});

module.exports = mongoose.model('User', userSchema);

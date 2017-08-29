var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    full_name: String,
    email: String,
    password: String,
    region: String,
    //quizzes_completed: [{quiz: ObjectId, score: Number, data: Date}]
});

module.exports = mongoose.model('User', userSchema);

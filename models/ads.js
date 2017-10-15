var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adSchema = new Schema({
    region: String,
    html: String,
    date: String
});

module.exports = mongoose.model('Ad', adSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var anouncementSchema = new Schema({
    region: String,
    html: String,
    date: String
});

module.exports = mongoose.model('Anouncement', anouncementSchema);

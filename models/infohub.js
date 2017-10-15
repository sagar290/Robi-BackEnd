var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var infoSchema = new Schema({
    region: String,
    html: String,
    date: String
});

module.exports = mongoose.model('Infohub', infoSchema);

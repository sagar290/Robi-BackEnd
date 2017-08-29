var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regionSchema = new Schema({
    region_name: String,
    population: Number
})

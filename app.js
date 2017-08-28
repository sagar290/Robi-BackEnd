var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var session = require('express-session');
var messages = require('express-messages');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kittens');
var db = mongoose.connection;

var connection = mongoose.connection;

    // we're connected!

    var kittySchema = mongoose.Schema({name: String});

    var Kitty = mongoose.model('Kitty', kittySchema);

    kittySchema.methods.speak = function() {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "A cat is no one";
        console.log(greeting);
    }

    var Kitty = mongoose.model('Kitty', kittySchema);
    var brad = new Kitty({name: 'Brad'});

    brad.save(function(err, brad) {
        if (err) console.log(err);
        brad.speak();
    });

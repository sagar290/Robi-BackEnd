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
var morgan = require('morgan');
mongoose.connect('mongodb://localhost/kittens');
var db = mongoose.connection;
var app = express();

/* Application port */
var port = process.env.port || 8080;

/* Set up the view engine */
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

/* Set up static path */
app.use(express.static('public'));

/* Set up middleware */
app.use(morgan('combined'));

app.get('/', function(req, res) {
    res.render('index', {name: 'Neymar'});
});

app.listen(port, function() {
    console.log("Running on port " + port);
});

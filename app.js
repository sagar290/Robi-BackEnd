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
var configDB = require('./config/database');
mongoose.connect(configDB.url);
var db = mongoose.connection;
var app = express();

/* Application port */
var port = process.env.PORT || 3030;

/* Set up routes */
var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var multiregister = require('./routes/multiregister');
var dashboard = require('./routes/dashboard');
var cms       = require('./routes/content-management');
var infohub   = require('./routes/infohub');
var ads       = require('./routes/ads');
var anouncements = require('./routes/anouncements');
var analytics    = require('./routes/analytics');
var regionentry  = require('./routes/regionentry');
var API          = require('./routes/api');

require('./config/passport')(passport);

/* Set up the view engine */
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

/* Set up static path */
app.use(express.static(path.join(__dirname, 'public')));

/* Set up middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'saynotorobi',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(passport.initialize());
app.use(passport.session());

/* Use Routes */
app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/multiregister', multiregister);
app.use('/dashboard', dashboard);
app.use('/content', cms);
app.use('/infohub', infohub);
app.use('/ads', ads);
app.use('/anouncements', anouncements);
app.use('/analytics', analytics);
app.use('/regionentry', regionentry);
app.use('/api', API);



app.listen(port, function() {
    console.log("Running on port " + port);
});

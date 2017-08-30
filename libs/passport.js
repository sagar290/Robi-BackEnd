var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local', new LocalStrategy({
        usernamefield: 'email',
        passwordfield: 'password'
    }, function(email, password, done) {

    }));
}

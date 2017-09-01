module.exports = {
    model: '',
    instance: null,
    insert: function(data){
        if(!this.model) {
            console.log('Missing Model Error');
        }
        else {
            if(this.model == 'user') {
                var bcrypt = require('bcryptjs');
                var User = require('../models/users');
                var newUser = new User();
                this.instance = newUser;
                newUser.full_name = data.full_name;
                newUser.email = data.email;
                newUser.region = data.region;
                newUser.password = newUser.generateHash(data.password);
                newUser.save(function(err) {
                    if(err) console.log(err);
                });
                //newUser.quizzes_completed = [];
            }
        }
    }
}

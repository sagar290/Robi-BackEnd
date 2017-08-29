module.exports = {
    model: '',
    insert: function(data){
        if(!this.model) {
            console.log('Missing Model Error');
        }
        else {
            if(this.model == 'user') {
                var bcrypt = require('bcryptjs');
                var User = require('../models/users');
                var newUser = new User();
                newUser.full_name = data.full_name;
                newUser.email = data.email;
                newUser.region = data.region;
                bcrypt.hash(data.password, 10, function(err, hash) {
                    newUser.password = hash;
                    newUser.save(function(err) {
                        if(err) console.log(err);
                    });
                });
                //newUser.quizzes_completed = [];
            }
        }
    }
}

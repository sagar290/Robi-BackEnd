module.exports = {
    model: '',
    insert: function(data){
        if(!this.model) {
            console.log('Missing Model Error');
        }
        else {
            if(this.model == 'user') {
                var User = require('../models/users');
                var newUser = new User();
                newUser.full_name = data.full_name;
                newUser.email = data.email;
                newUser.password= data.password;
                newUser.region = data.region;
                //newUser.quizzes_completed = [];

                newUser.save(function(err) {
                    if(err) console.log(err);
                });
            }
        }
    }
}

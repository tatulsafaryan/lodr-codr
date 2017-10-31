const crypto = require('crypto');

const Utility = require('./../services/utility');
const AppConstants = require('./../settings/constants');
const UserValidator = require('./../services/validators/user-validator');

module.exports = function (app) {

    app.get('/api/users', (req, res) => {
        app.db.users.find({})
            .skip(req.query.offset)
            .limit(req.query.limit)
            .exec((err, data) => {
                if (err) {
                    return res.send('Not found');
                }
                return res.send(data);
            });
    });

    // Create function
    app.post('/api/users', (req, res) => {
        let user = {
            username : req.body.username,
            password : req.body.password,
            name : req.body.name,
            age : req.body.age,
            email : req.body.email
        }

        let uv_response = UserValidator.validateUsername(user.username);
        if (uv_response != Utility.ErrorTypes.SUCCESS) {
             return res.send(Utility.generateErrorMessage(uv_response));
         }


         let pass_response = UserValidator.validatePassword(user.password);
         if (pass_response != Utility.ErrorTypes.SUCCESS) {
              return res.send(Utility.generateErrorMessage(pass_response));
          }

        user.password = crypto.createHash('sha1').update(user.password + 'chlp').digest('hex');

        app.db.users.findOne({username: user.username}, (err, data) => {
            if (data) {
                return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.INVALID_USERNAME_IDENTIFIER));
            }
        })
        // TODO: check and validate name, check and validate age
        app.db.users.create(user, (err, data) => {
            if (err) {
                return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_CREATION_ERROR));
            }
            return res.send(data);
        });
    });

    app.delete('/api/users/:id',(req,res) => {
        let id = req.params.id;
        if(!id) {
            return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR));
        }
        app.db.users.findOneAndRemove({_id:id} , (err,data)=> {
           if(err) {
              return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_DELETE_ERROR));
           }
           return res.send(data);
        })
    });

     app.put('/api/users/:id',(req,res) => {
        app.db.users.find({_id:req.params.id },(err,data) => {
           if(err) {
              return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR));
           }
           let user = {

             username : req.body.username,
             password : req.body.password,
             name : req.body.name,
             age : req.body.age,
             email : req.body.email
           }
           user.username ? user.username = user.username : user.username = data.username;
           user.password ? user.password = user.password : user.password = data.password;
           user.name ? user.name = user.name : user.name = data.name;
           user.age ? user.age = user.age : user.age = data.age;
           user.email ? user.email = user.email : user.email = data.email;

           let uv_response = UserValidator.validateUsername(user.username);
           if (uv_response != Utility.ErrorTypes.SUCCESS) {
                return res.send(Utility.generateErrorMessage(uv_response));
            }
            let pass_response = UserValidator.validateUsername(user.password);
            if (pass_response != Utility.ErrorTypes.SUCCESS) {
                 return res.send(Utility.generateErrorMessage(pass_response));
             }

           user.password = crypto.createHash('sha1').update(user.password + 'chlp').digest('hex');

           app.db.users.update({_id:req.params.id},{$set:{username: user.username,
                                                          name : user.name,
                                                          age : user.age,
                                                          email : user.email,
                                                          password : user.password }},(err,value) => {
              //console.log(value);
              if(err) {
                return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_UPDATE_ERROR));
              }
              return res.send(value);
           });
        });
     });
}
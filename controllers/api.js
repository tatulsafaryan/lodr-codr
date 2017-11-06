const crypto = require('crypto');

const Utility = require('./../services/utility');
const AppConstants = require('./../settings/constants');
const UserValidator = require('./../services/validators/user-validator');


//CRUD (Create, Read, Update, Delete) operations
module.exports = function (app) {
    function _auth(permission) {
      return function (req, res, next) {
        if (permission == 'optional') {
          return next();
        }
        if (permission == 'user') {
          app.db.users.findOne({key: req.query.key}, (err, user) => {
            if (!user) {
              return res.send(Utility.generateErrorMessage(
                Utility.ErrorTypes.PERMISSION_DENIED)
              );
            }
            req.user = user;
            return next();
          });
        }
        if (permission == 'admin') {
          app.db.users.findOne({key: req.query.key, role: 'admin'}, (err, user) => {
                if (!user) {
                  return res.send(Utility.generateErrorMessage(
                    Utility.ErrorTypes.PERMISSION_DENIED)
                  );
                }
                req.user = user;
                return next();
              });
        }
      }
    }

    // Read operation
    app.get('/api/users', _auth('user'), (req, res) => {
      if (!req.query.key) {
        return res.send(Utility.generateErrorMessage(
          Utility.ErrorTypes.PERMISSION_DENIED)
        );
      }
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

    //Create operation
    app.post('/api/users', _auth('optional'), (req, res) => {
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

      if(user.name) {
               let name_response = UserValidator.validateName(user.name);
               if (name_response != Utility.ErrorTypes.SUCCESS) {
                    return res.send(Utility.generateErrorMessage(name_response));
                }
           }

      if(user.age) {
               let age_response = UserValidator.validateAge(user.age);
               if (age_response != Utility.ErrorTypes.SUCCESS) {
                    return res.send(Utility.generateErrorMessage(age_response));
                }
           }

      if(user.email) {
               let email_response = UserValidator.validateEmail(user.email);
               if (email_response != Utility.ErrorTypes.SUCCESS) {
                    return res.send(Utility.generateErrorMessage(email_response));
                }
           }

      user.password = crypto.createHash('sha1').update(user.password + 'chlp').digest('hex');

      app.db.users.findOne({username: user.username}, (err, data) => {
              if (data) {
                  return res.send(Utility.generateErrorMessage(
                    Utility.ErrorTypes.INVALID_USERNAME_IDENTIFIER)
                  );
              }
          })
      // TODO: check and validate name, check and validate age
      app.db.users.create(user, (err, data) => {
        if (err) {
                  return res.send(Utility.generateErrorMessage(
                    Utility.ErrorTypes.USER_CREATION_ERROR)
                  );
              }
        return res.send(data);
      });
    });

    //Delete operation
    app.delete('/api/users/:id', _auth('admin'), (req,res) => {
      app.db.users.findOne({key: req.query.key, role: 'admin'}, (err, user) => {
        if (err || !user) {
          return res.send(Utility.generateErrorMessage(
            Utility.ErrorTypes.PERMISSION_DENIED)
          );
        }
      })
      let id = req.params.id;
      if(!id) {
            return res.send(Utility.generateErrorMessage(
              Utility.ErrorTypes.USER_ID_ERROR)
            );
        }
      app.db.users.findOneAndRemove({_id:id} , (err,data)=> {
           if(err) {
              return res.send(Utility.generateErrorMessage(
                Utility.ErrorTypes.USER_DELETE_ERROR)
              );
           }
           return res.send(data);
        })
    });

    //Update operation
    app.put('/api/users/:id', _auth('user'), (req,res) => {
      if (req.user.role != 'admin') {
        if (req.params.id != req.user._id) {
          return res.send(Utility.generateErrorMessage(
            Utility.ErrorTypes.PERMISSION_DENIED)
          );
        }
      }
      app.db.users.find({_id:req.params.id },(err,data) => {
        if(err) {
                  return res.send(Utility.generateErrorMessage(
                    Utility.ErrorTypes.USER_ID_ERROR)
                  );
               }
        let user = {
                 username : req.body.username || data.username,
                 password : req.body.password || data.password,
                 name : req.body.name || data.name,
                 age : req.body.age || data.age,
                 email : req.body.email || data.email
               }
        let uv_response = UserValidator.validateUsername(user.username);
        if (uv_response != Utility.ErrorTypes.SUCCESS) {
                    return res.send(Utility.generateErrorMessage(uv_response));
                }

                let pass_response = UserValidator.validateUsername(user.password);
                if (pass_response != Utility.ErrorTypes.SUCCESS) {
                     return res.send(Utility.generateErrorMessage(pass_response));
                 }

                 if(user.name) {
                     let name_response = UserValidator.validateName(user.name);
                     if (name_response != Utility.ErrorTypes.SUCCESS) {
                          return res.send(Utility.generateErrorMessage(name_response));
                      }
                 }

                 if(user.age) {
                     let age_response = UserValidator.validateAge(user.age);
                     if (age_response != Utility.ErrorTypes.SUCCESS) {
                          return res.send(Utility.generateErrorMessage(age_response));
                      }
                 }

                 if(user.email) {
                     let email_response = UserValidator.validateEmail(user.email);
                     if (email_response != Utility.ErrorTypes.SUCCESS) {
                          return res.send(Utility.generateErrorMessage(email_response));
                      }
                 }

        user.password = crypto.createHash('sha1').update(user.password + 'chlp').digest('hex');

        app.db.users.update({_id:req.params.id},{$set: user},(err,value) => {
          if(err) {
                    return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_UPDATE_ERROR));
                  }
          return res.send(value);
        });
      });
    });

///////////////////////////////////create codes area///////////////////////////////////


    app.get('/api/codes', _auth('user'), (req, res) => {
      if (!req.query.key) {
        return res.send(Utility.generateErrorMessage(
          Utility.ErrorTypes.CODE_PERMISSION_DENIED)
        );
      }
      app.db.codes.find({})
              .populate('author',['name', 'username','role'])
              .skip(req.query.offset)
              .limit(req.query.limit)
              .exec((err, data) => {
                  if (err) {
                      return res.send('Not found');
                  }
                  return res.send(data);
              });
    });

    //Create operation
    app.post('/api/codes', _auth('user'), (req, res) => {
      if (!req.query.key) {
        return res.send(Utility.generateErrorMessage(
          Utility.ErrorTypes.CODE_PERMISSION_DENIED)
        );
      }
      let code = {
        content: req.body.content,
        language: req.body.language,
        author: req.body.author
      }
      app.db.codes.create(code,(err, data) => {
        if (err) {
          console.log(err);
            return res.send(Utility.generateErrorMessage(
                  Utility.ErrorTypes.CODE_CREATION_ERROR)
                  );
        }
        return res.send(data);
      });
    });

    //Delete operation
    app.delete('/api/codes/:id', _auth('user'), (req,res) => {
       app.db.codes.findOne({author:{_id: req.query._id }}, (err, user) => {
         if (err || !user) {
           return res.send(Utility.generateErrorMessage(
             Utility.ErrorTypes.CODE_PERMISSION_DENIED)
           );
         }
       })
       let id = req.params.id;
       if(!id) {
             return res.send(Utility.generateErrorMessage(
               Utility.ErrorTypes.CODE_ID_ERROR)
             );
         }
       app.db.codes.findOneAndRemove({ _id: id, author:{_id: req.query._id }} , (err,data)=> {
            if(err) {
               return res.send(Utility.generateErrorMessage(
                 Utility.ErrorTypes.CODE_DELETE_ERROR)
               );
            }
            return res.send(data);
       })
     });

    //Update operation
    app.put('/api/codes/:id', _auth('user'), (req,res) => {
      if (!req.query._id) {
        return res.send(Utility.generateErrorMessage(
          Utility.ErrorTypes.CODE_PERMISSION_DENIED)
        );
      }
      app.db.codes.find({_id: req.params.id },(err,data) => {
        if(err) {
           return res.send(Utility.generateErrorMessage(
            Utility.ErrorTypes.CODE_ID_ERROR)
            );
        }
        let code = {
          content: req.body.content,
          language: req.body.language,
          author: req.query._id
        }
        app.db.codes.update({_id:req.params.id},{$set: code},(err,value) => {
          if(err) {
            return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.CODE_UPDATE_ERROR));
          }
          return res.send(value);
        });
      });
    });

}

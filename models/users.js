const mongoose = require('mongoose');
const keygen = require('keygenerator');
const Schema = mongoose.Schema;

const AppConstants = require('./../settings/constants');

function generateAPIKey() {
    return (keygen._({ length: 2 }) + '-' + keygen._({ length: 6 })
        + '-' + keygen.number()
        + '-' + keygen._({ length: 6 })
        + '-' + keygen._({ length: 8 })).replace(/&/g, '');
}

let UsersSchema = Schema({

    key: {
        type: String,
        default: generateAPIKey
    },
    username: {
        type: String,
        index: {unique: true},
        minlength: AppConstants.USERNAME_MIN_LENGTH,
        maxlength: AppConstants.USERNAME_MAX_LENGTH
    },
    password: {
        type: String,
        minlength: AppConstants.PASSWORD_MIN_LENGTH,
        maxlength: AppConstants.PASSWORD_MAX_LENGTH
    },
    email: {
        type: String,
        lowercase: true,
        minlength: AppConstants.EMAIL_MIN_LENGTH,
        maxlength: AppConstants.EMAIL_MAX_LENGTH
        // TODO: email validation in services
    },
    age: {
        type: Number,
        minlength: AppConstants.AGE_MIN_LENGTH,
        maxlength: AppConstants.AGE_MAX_LENGTH,
        default: null
    },
    name: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('users', UsersSchema);

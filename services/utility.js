const AppConstants = require('./../settings/constants');

const ErrorTypes = {
    SUCCESS: 'success',
    VALIDATION_ERROR: 'validation_error',
    USERNAME_MISSING: 'username_missing',
    PASSWORD_MISSING: 'password_missing',
    INVALID_USERNAME_RANGE: 'invalid_username_range',
    INVALID_PASSWORD_RANGE: 'invalid_password_range',
    INVALID_USERNAME_IDENTIFIER: 'invalid_username_identifier',
    USER_CREATION_ERROR: 'user_creation_error',
    USER_DELETE_ERROR: 'user_delete_error',
    USER_ID_ERROR: 'user_id_error',
    USER_UPDATE_ERROR: 'user_update_error',
    UNKNOWN_ERROR: 'unknown_error'
};

class Utility {
    static parseQuery(req, res, next) {
        req.query.offset = parseInt(req.query.offset);
        if (!isFinite(req.query.offset)) {
            req.query.offset = AppConstants.OFFSET_DEFAULT_VALUE;
        }

        req.query.limit = parseInt(req.query.limit);
        if (!isFinite(req.query.limit)) {
            req.query.limit = AppConstants.LIMIT_DEFAULT_VALUE;
        }
        next();
    }

    static generateErrorMessage(type, options) {
        options = options || {};
        let error_object = {
            type: type || ErrorTypes.UNKNOWN_ERROR,
            message: 'Something went wrong..'
        };
        switch (type) {
            case ErrorTypes.USERNAME_MISSING:
                error_object.message = 'Username is not specified.';
                break;
            case ErrorTypes.PASSWORD_MISSING:
                error_object.message = 'Password is not specified.';
                break;
            case ErrorTypes.INVALID_USERNAME_RANGE:
                error_object.message = 'Invalid min/max value for username, must be >= {min} and <= {max}, your value is: {val}'.replace('{min}', AppConstants.USERNAME_MIN_LENGTH)
                            .replace('{max}', AppConstants.USERNAME_MAX_LENGTH);
                break;
            case ErrorTypes.INVALID_PASSWORD_RANGE:
                error_object.message = 'Invalid min/max value for password.'; 
                break;
            case ErrorTypes.USER_CREATION_ERROR:
                error_object.message = 'Failed to create a user.';
                break;
            case ErrorTypes.INVALID_USERNAME_IDENTIFIER:
                error_object.message = 'User already exists.';
                break;
            case ErrorTypes.USER_DELETE_ERROR:
                error_object.message = 'User can not deleted';
                break;
            case ErrorTypes.USER_ID_ERROR:
                error_object.message = 'User id is undefined';
                break;
            case ErrorTypes.USER_UPDATE_ERROR:
                error_object.message = 'User can not updated';
                break;
        }
        return error_object;
    }
}

module.exports = Utility;
module.exports.ErrorTypes = ErrorTypes;
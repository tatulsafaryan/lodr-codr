const BaseValidator = require('./base');

const UsernameValidator = require('./username-validator');
const PasswordValidator = require('./password-validator');

const Utility = require('./../utility');
const AppConstants = require('./../../settings/constants');

class UserValidator extends BaseValidator {
    constructor() {
        super();
    }

    validateUsername(username, sanitize) {

        if (!username) {

            return Utility.ErrorTypes.USERNAME_MISSING;
        }
        if (username.length < AppConstants.USERNAME_MIN_LENGTH
            || username.length > AppConstants.USERNAME_MAX_LENGTH)
        {
            return Utility.ErrorTypes.INVALID_USERNAME_RANGE;
        }
        console.log(UsernameValidator.validator(username));
        return UsernameValidator.validator(username);
        // TODO:
        /*
        if (sanitize) {
            _sanitizeUsername(username);
        }
        */
    }

    validatePassword(password, sanitize) {
      if (!password) {
          return Utility.ErrorTypes.PASSWORD_MISSING;
      }
      if (password.length < AppConstants.PASSWORD_MIN_LENGTH
          || password.length > AppConstants.PASSWORD_MAX_LENGTH)
      {
          return Utility.ErrorTypes.INVALID_PASSWORD_RANGE;
      }
      let PasswordValid = PasswordValidator.validator(password);
      return PasswordValid;
    }

}

module.exports = new UserValidator();

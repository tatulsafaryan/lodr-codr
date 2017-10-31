const AppConstants = {
  LIMIT_DEFAULT_VALUE : 20,
  OFFSET_DEFAULT_VALUE:0,
  DB_URL:'127.0.0.1:27017/lodrkodrdb',
  USERNAME_MIN_LENGTH:4,
  USERNAME_MAX_LENGTH:20,
  PASSWORD_MIN_LENGTH:6,
  PASSWORD_MAX_LENGTH:64,
  NAME_MIN_LENGTH:1,
  NAME_MAX_LENGTH:20,
  AGE_MIN_LENGT: 14,
  AGE_MAX_LENGTH: 101,
  EMAIL_MIN_LENGTH: 6,
  EMAIL_MAX_LENGTH:30,
  NUMBER_REG_EXP: /^[+-]?(([0-9])+([.][0-9]*)?|[.][0-9]+)$/,
  SYMBOL_REG_EXP: /^[!@#\$%\^\&*\)\(+=~._-]+$/,
  EMAIL_REG_EXP:  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  NAME_REG_EXP:    /^([A-Z]+)+([a-z]+)+([0-9]+)+([-_.])$/
}

module.exports = AppConstants;

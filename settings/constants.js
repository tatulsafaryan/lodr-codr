const AppConstants = {
  LIMIT_DEFAULT_VALUE : 20,
  OFFSET_DEFAULT_VALUE:0,
  DB_URL:'127.0.0.1:27017/lodrkodrdb',
  USERNAME_MIN_LENGTH:4,
  USERNAME_MAX_LENGTH:20,
  PASSWORD_MIN_LENGTH:6,
  PASSWORD_MAX_LENGTH:64,
  AGE_MIN_LENGTH: 14,
  AGE_MAX_LENGTH: 101,
  EMAIL_MIN_LENGTH: 6,
  EMAIL_MAX_LENGTH:30,
  NUMBER_REG_EXP: /^[+-]?(([0-9])+([.][0-9]*)?|[.][0-9]+)$/,
  SYMBOL_REG_EXP: /^[!@#\$%\^\&*\)\(+=~._-]+$/
}

module.exports = AppConstants;

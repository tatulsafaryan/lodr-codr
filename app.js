const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const Utility = require('./services/utility');
const AppConstants = require('./settings/constants');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(Utility.parseQuery);

require('./models/users');
require('./models/codes');
const con = mongoose.createConnection(AppConstants.DB_URL);
app.db = {
  users: con.model('users'),
  codes: con.model('codes')
}

require('./controllers/api')(app);

app.listen(3006);

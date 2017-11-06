const mongoose = require('mongoose');
//const keygen = require('keygenerator');
const Schema = mongoose.Schema;

const AppConstants = require('./../settings/constants');

let CodeSchema = Schema({
    content: {
      type: String,
      default: null
    },
    language: {
      type: String,
      enum: ['c++', 'node.js', 'javascript', 'c#'],
      default: 'c++'
    },
    author: {
      ref: 'users',
      type: Schema.ObjectId,
      index: true,
      default: null
    },
    team: {
      type: String,
      default: null
    }

})

module.exports = mongoose.model('codes', CodeSchema);

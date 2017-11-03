const mongoose = require('mongoose');
//const keygen = require('keygenerator');
const Schema = mongoose.Schema;

const AppConstants = require('./../settings/constants');

let CodeSchema = Schema({
    content: {
      /*title:{
        type: String,
        default: 'Code title'
      }*/
      type: String,
      default: null
    },
    language: {
      type: String,
      enum: ['c++', 'node.js', 'javascript', 'c#'],
      default: 'c++'
    },
    author: {
      type: String,
      default: null
    },
    team: {
      type: String,
      default: null
    }

})

module.exports = mongoose.model('codes', CodeSchema);

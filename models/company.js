var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//creating schema for company
var Schema = mongoose.Schema;
var CompanySchema = new Schema({
  name : {
    type: String,
    index: true,
    unique: true
  },
  kitchen : Array,
  about : String,
  adress : String,
  dishes : Array,
  phone : String,
  email : String
});

var Company = mongoose.model('Company', CompanySchema);
module.exports = Company;

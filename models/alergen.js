var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Schema for alergens
var Schema = mongoose.Schema;
var AlergenSchema = new Schema({
  name : String
});
var Alergen = mongoose.model('Alergen', AlergenSchema);

module.exports = Alergen;

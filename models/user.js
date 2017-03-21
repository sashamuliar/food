var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

//creating User Schema for mongoose
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    index: true,
    unique: true
  },
  email: String,
  password: String
});

UserSchema.methods.comparePasswords = function(enteredPassword, storedPassword){
  console.log('User ' + storedPassword);
  return enteredPassword === storedPassword;
};

var User = mongoose.model('User', UserSchema);

module.exports = User;

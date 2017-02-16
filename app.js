//modules for app
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoClient = require('mongodb').MongoClient;

var app = express();
//app configurations
app.set('view engine', 'ejs');
//routs
app.use(require('./routs'));
//acces to style things

app.use(express.static(path.join(__dirname, 'mystyle')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.listen(3000, function(){
  console.log('server is dancing with port 3000');
});

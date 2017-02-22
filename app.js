//modules for app
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoClient = require('mongodb').MongoClient;

var app = express();
//app configurations
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//routs
app.use(require('./routs'));

//acces to style things
app.use(express.static(path.join(__dirname, 'mystyle')));
app.use(express.static(path.join(__dirname, 'bower_components')));
//PORT
var PORT = process.env.PORT || 3000;



mongoClient.connect('mongodb://localhost:27017/food', function(err, database){
  if (err) {
    return console.log(err)
  }
  db = database;
  app.listen(PORT, function(){
    console.log('server is dancing with port ' + PORT);
  });
})

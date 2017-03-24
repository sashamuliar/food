//modules for app
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var app = express();
//app configurations
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(expressValidator());
app.use(session({secret: 'boo', saveUninitialized: false, resave: false}));

//passport init
app.use(passport.initialize());
app.use(passport.session());
//flash
app.use(flash());
//global validationErrors
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
//routs
app.use('/', require('./routs'));

//acces to style things
app.use(express.static(path.join(__dirname, 'mystyle')));
app.use(express.static(path.join(__dirname, 'bower_components')));
//PORT
var PORT = process.env.PORT || 3000;
//db uri
var uri = 'mongodb://localhost/food';


//conection to db
mongoose.connect(uri, function(error){
  if (error){
    return console.log('failed to connect to db');
  } else {
    console.log('connection is good');
    app.listen(PORT, function(){
      console.log('server is dancing with port ' + PORT);
    })
  }
});

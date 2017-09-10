var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var Company = require('./models/company');
var Alergen = require('./models/alergen');


router.get('/', function(req, res){
  Company.find().exec(function(err, companies){
    if (err) console.log(err);
    var cities = companies.map(function(company){
      return company.city;
    });
    // var newCities = [];
    // for (var i = 0; i < cities.length; i++){
    //   for (var b = 0; b < cities.length; b++){
    //     if (cities[i] == cities.[b])
    //   }
    // }
    var unique = cities.filter(function(value, index){
      return cities.indexOf(value) === index //&& cities.indexOf(value) >= 0//;
    })

    res.render('index', {cities : unique});
  });
});


router.get('/ajax',function(req, res){
  console.log('ajax here');
  res.render('ajax');
});

router.post('/products',function(req, res){
  var typing = req.body.typing;
  var city = req.body.city;
  if (city){
    Company.find({ name:{ $regex: typing, $options: 'i' }})
    .where({ city : city })
    .exec(function(err, companies){
      if (err) console.log(err);
      var findedCompanies = companies.map(function(company){
          return company.name;
      });
      res.send({products: findedCompanies});
    });
  } else {
    Company.find({ name:{ $regex: typing, $options: 'i' }})
    .exec(function(err, companies){
      if (err) console.log(err);
      var findedCompanies = companies.map(function(company){
          return company.name;
      });
      res.send({products: findedCompanies});
    });
  }

});


router.get('/add_alergen', function(req, res){
  Alergen.find().exec(function(err, alergens){
    if (err) console.log(err);
    var allAlergens = alergens.map(function(alergen){
      return alergen.name;
    });
    res.render('add_alergen', {
      alergens: allAlergens
    });
  });
});

router.get('/add_company', function(req, res){
  Alergen.find().exec(function(err, alergens){
    if (err) console.log(err);
    var allAlergens = alergens.map(function(alergen){
      return alergen.name;
    });
    Company.find().exec(function(err, companies){
      if (err) console.log(err);
      var allCompanies = companies.map(function(company){
        return company.name;
      });
      res.render('add_company', {
        alergens: allAlergens,
        companies: allCompanies
      });
    });
  });
});

//adding new alergens
router.post('/add_alergen', function(req, res){
  var newAlergen = new Alergen ({ name: req.body.new_alergen });
   Alergen.findOne({ name: {$regex: req.body.new_alergen , $options: 'ix'}}, function(err, alergen){
     if (err) return err;
     if (alergen){
       res.redirect('/add_alergen');
     } else {
       newAlergen.save(function(err){
         if (err) {
           console.log(err);
           return res.sendStatus(500);
         };
         req.flash('success_msg', newAlergen.name + ' saved alergen');
         res.redirect('/add_alergen');
       });
     };
   });
});

//deleting alergens
router.post('/delete_alergen', function(req, res){
  var deleting_alergen = req.body.delete_alergen;
  Alergen.remove({ name:deleting_alergen }, function(err, result){
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    req.flash('success_msg', deleting_alergen + ' suceessfully deleted')
    res.redirect('/add_alergen');
  });
});

// adding new companies
router.post('/add_company', function(req, res){
  var newCompany = new Company ({
    name: req.body.new_company,
    kitchen: req.body.kitchen,
    about: req.body.about_company,
    city: req.body.city,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email
  });
  newCompany.dishes.push({
    dish:req.body.dish_name,
    alergens:req.body.alergens
  });
  newCompany.save(function(err){
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    console.log('Company ' + newCompany.name + ' added!');
    res.redirect('/add_company');
  });
});

router.get('/register', function(req, res){
  res.render('register',{errors: undefined});

});

router.post('/register', function(req, res){
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors){
    res.render('register', {errors:errors});
    console.log(errors);
  } else {
    var newUser = new User({
      name:req.body.name,
      username:req.body.username,
      email:req.body.email,
      password:req.body.password
    });
    var usern = req.body.username;
    User.findOne({username:{$regex: req.body.username, $options: 'ix'}}, function(err, user){
      if (err) {
          return err
      }
      if (user) {
        req.flash('error_msg', 'Username is already exists');
        res.redirect('register');
      } else {
        newUser.save(function(err){
          if (err){
            console.log(err);
          }
          console.log('user saved');
        });
        console.log(newUser);
        req.flash('success_msg', 'You are registered and now can login');
        res.redirect('login');
      };
    });
  };
});

router.get('/login', function(req, res){
  res.render('login', { msg:undefined });
});

///////////////////////
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('no user');
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.comparePasswords(password, user.password)) {
        console.log('wrong pass');
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log('passed');
      return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


router.post('/login',
  passport.authenticate('local',
  {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash: true,
  }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/login');
});

router.get('/restaurants/:name', function(req, res){
  var restaurantName = toSpaces(req.params.name);
  var query = new RegExp(restaurantName, 'i');
  Company.findOne({name : { $regex: query, $options: 'i' }}, function(err, restaurant){
    if (restaurant) {
      res.render('restaurant', {
        restaurant:restaurant
      })
    } else {
      res.sendStatus(404);
    }
  });
});
function toUnderscore(str){
  return str.replace(/ /g, '_');
};
function toSpaces(str){
  return str.replace(/_/g, ' ');
};

module.exports = router;

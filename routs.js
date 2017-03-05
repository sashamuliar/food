var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


router.get('/', function(req, res){
  res.render('index');
});


router.get('/ajax',function(req, res){
  console.log('ajax here');
  res.render('ajax');
});

router.post('/products',function(req, res){
  var typing = req.body.typing;
  db.collection('alergens')
    .find(
      {name:{$regex: typing, $options: 'ix'}},
      {name:1, _id:0}
    )
    // .limit(5)
    .toArray(function(err, docs) {
             if (err) { console.log(err) };
             var allAlergens = docs.map(function(doc){
                 return doc.name;
            });
            res.send({products: allAlergens});
          });
});


router.get('/add_alergen', function(req, res){
  db.collection('alergens').find().toArray(function(err, docs) {
      if (err) { console.log(err) };
      var allAlergens = docs.map(function(doc){
          return doc.name;
        });
      res.render('add_alergen', {
        alergens: allAlergens
      });
    });
});

router.get('/add_company', function(req, res){
  db.collection('alergens').find().toArray(function(err, docs) {
      if (err) { console.log(err) };
      var allAlergens = docs.map(function(doc){
          return doc.name;
        });
      db.collection('companies').find().toArray(function(err, docs) {
        if (err) { console.log(err) };
        var allCompanies = docs.map(function(doc){
            return doc.name;
          });
        res.render('add_company', {
          alergens: allAlergens,
          companies: allCompanies
        });
      })
    });
});

//adding new alergens
router.post('/add_alergen', function(req, res){
  var alergen = { name: req.body.new_alergen };
  db.collection('alergens').find().toArray(function(err, docs) {
      if (err) { console.log(err) };
      var allAlergens = docs.map(function(doc){
          return doc.name;
      });
      var rule = false;
      allAlergens.forEach(function(single){
        if (single === alergen.name) {
          return rule = true;
        };
      });
      if (rule) {
        res.redirect('/add_alergen');
      } else {
        db.collection('alergens').insert(alergen, function(err, result){
          if (err) console.log(err);
          res.redirect('/add_alergen');
        });
      }
  });
});

//deleting alergens

router.post('/delete_alergen', function(req, res){
  console.log(req.body.delete_alergen);
  db.collection('alergens').deleteOne(
    {name: req.body.delete_alergen},
    function(err, result) {
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.send('deleted ' + req.body.delete_alergen);
    }
  );
})
// adding new companies
router.post('/add_company', function(req, res){
  var newCompany = {
    name: req.body.new_company,
    kitchen: req.body.kitchen,
    about: req.body.about_company
  };
  newCompany.dishes = [];
  newCompany.dishes.push({
    dish:req.body.dish_name,
    alergens:req.body.alergens
  });
  db.collection('companies').insert(newCompany, function(err, result){
    if (err) console.log(err);
    res.redirect('/add_company');
  });
  console.log('Company ' + newCompany.name + ' added!');
});

router.get('/register', function(req, res){
  res.render('register',{errors: undefined});

});

router.post('/register', function(req, res){
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
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
    newUser.save(function(){
      console.log('user saved');
    })
    console.log(newUser);
    req.flash('success_msg', 'You are registered and now can login');
    res.redirect('login');
  };


});

router.get('/login', function(req, res){
  res.render('login', {msg:undefined});
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

/////////////////////////
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    index: true
  },
  email: String,
  password: String
});

UserSchema.methods.comparePasswords = function(enteredPassword, storedPassword){
  console.log('User ' + storedPassword);
  return enteredPassword === storedPassword;
};

var User = mongoose.model('User', UserSchema);



module.exports = router;

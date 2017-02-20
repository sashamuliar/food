var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res){
  res.render('index');
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


module.exports = router;

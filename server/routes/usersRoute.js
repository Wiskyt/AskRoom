var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var DB = require('../database');

var Users = require('../users');
Users.init();

passport.use(new LocalStrategy(
  function(username, password, done) {
    DB.findUserByName({username: username}, function (err, user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  Users.addUser(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var user = Users.getUserById(id);
  console.log("Deserialized " + id + " : " + user.username);
  done(null, user);
});

router.post('/login',
  passport.authenticate('local', { failWithError: true }),
    function(req, res, next) {
      console.log("Cookie", eq.session.cookie);
      if (req.body.remember) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
        } else {
          req.session.cookie.expires = false; // Cookie expires at end of session
        }
      return res.json({ username: req.user.username });
    },
    function(err, req, res, next) {
      return res.json(err);
    }
);


module.exports = router;

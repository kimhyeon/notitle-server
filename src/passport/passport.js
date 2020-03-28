const passport = require('passport');
const localStrategy = require('passport-local');
const { users } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
};

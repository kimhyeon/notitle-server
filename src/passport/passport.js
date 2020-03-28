const LocalStrategy = require('passport-local');
const { users } = require('../models');

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'pwd',
        session: true
      },
      (email, pwd, done) => {
        (async () => {
          try {
            let user = await users.findOne({
              where: {
                email: email
              }
            });
            if (user === null) {
              return done(null, false, { message: 'Incorrect email.' });
            }
            if (pwd !== user.pwd) {
              return done(null, false, { message: 'Incorrect pwd.' });
            }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        })();
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    users
      .findOne({
        where: {
          id: id
        }
      })
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
};

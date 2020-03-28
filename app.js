const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport');
const passportCofing = require('./src/passport/passport');

const users = require('./src/api/users/index');

const app = express();

// db
var sequelize = require('./src/models').sequelize;
sequelize
  .authenticate()
  .then(() => {
    console.log('🔵 Connected to DB successfully.');
  })
  .catch(err => {
    console.error('🔴 Unable to connect to the database:', err);
  });

sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// passport setting ...
app.use(
  session({ secret: 'anything', resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
passportCofing(passport);

// api s
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[
  env
];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config,
  username,
  config.password,
  config
);

// 객체를 편하게 쓰기위해 그냥 다 담아줍니다.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);

module.exports = db;

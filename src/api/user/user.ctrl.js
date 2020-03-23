const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { user } = require('../../models');

const service = require('./user.service');

const insert = (req, res) => {
  if (req.body === {}) return res.status(400).end();

  const {
    email: req_email,
    pwd: req_pwd,
    name: req_name,
    age: req_age
  } = req.body;
  if (!req_email || !req_pwd || !req_name || !req_age)
    return res.status(400).end();

  (async () => {
    try {
      let duplicateUsers = await service.findDuplicatedUser(req_email);
      console.log('[duplicateUsers]', duplicateUsers.length);
      if (duplicateUsers.length > 0) {
        res
          .status(409)
          .json({ result: -1, info: 'user certificated email duplicated.' });
        return;
      }

      let newUser = await service.saveNewUser(req.body);
      let { id, email, name } = newUser;

      res.status(200).json({ result: 1, user: { id, email, name } });
    } catch (err) {
      console.log('[err]', err.name, err);
      res.status(500).json({ result: -1, info: err });
    }
  })();
};

const select = (req, res) => {};

const update = (req, res) => {};

const remove = (req, res) => {};

module.exports = { insert };

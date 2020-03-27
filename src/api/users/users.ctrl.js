const service = require('./users.service');

const insert = (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res
      .status(400)
      .json({
        message:
          'request body is null, body Need to datas (email, pwd, name, age)'
      })
      .end();

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
      if (duplicateUsers.length > 0) {
        res
          .status(409)
          .json({ message: `this email (${req_email}) already joined.` });
        return;
      }

      let newUser = await service.saveNewUser(req.body);
      let { id, email, name } = newUser;

      res.status(200).json({ user: { id, email, name } });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  })();
};

const selectUserByID = (req, res) => {
  const { id } = req.params;

  console.log('[params]', req.params);

  if (id === undefined) {
    return res.status(400).json({ message: 'id param is null.' });
  }

  (async () => {
    try {
      let user = await service.selectUserByID(id);
      console.log('[user]', user === null);
      if (user === null) {
        return res.status(404).json({ message: 'user not founded.' });
      }
      res.status(200).json({ user: user });
    } catch (err) {
      console.log('[err]', err);
      res.status(500).json({ message: err });
    }
  })();
};

const selectUsersByName = (req, res) => {
  const { name } = req.query;

  console.log('NAME', name, req.query);

  if (name === undefined) {
    return res.status(400).json({ message: 'name param is null.' });
  }

  (async () => {
    try {
      let users = await service.selectUsersByName(name);
      if (users.length === 0) {
        res.status(404).json({ message: 'users not founded.' });
        return;
      }
      res.status(200).json({ users: users });
    } catch (err) {
      console.log('[err]', err);
      res.status(500).json({ message: err });
    }
  })();
};

const update = (req, res) => {
  let { id } = req.params,
    body = req.body,
    bodyKeys = Object.keys(body);

  if (id === undefined) {
    return res.status(400).json({ message: 'id param is null.' });
  }

  if (bodyKeys.length === 0) {
    return res.status(400).json({ message: 'request body is null' });
  } else {
    let validKeys = [
      'pwd',
      'name',
      'profile',
      'profile_back',
      'status_message',
      'email_certification_flag'
    ];

    let isValid = false;
    validKeys.some(validKey => {
      if (body[validKey] !== undefined) {
        isValid = true;
        return true;
      }
    });

    if (isValid === false) {
      return res
        .status(400)
        .json({ message: 'request body keys are invalid.' });
    }
  }

  console.log('##', id, body);

  (async () => {
    try {
      let result = await service.updateUser(id, body),
        user = await service.selectUserByID(id);
      console.log('[result]', result, user.pwd);
      return res.status(200).json({ user: user, updateCount: result[0] });
    } catch (err) {
      console.log('[err]', err);
      res.status(500).json({ message: err });
    }
  })();
};

const remove = (req, res) => {
  let { id } = req.params;

  if (id === undefined) {
    return res.status(400).json({ message: 'id param is null.' });
  }

  (async () => {
    try {
      let result = await service.removeUser(id);
      console.log('[result]', id, result);
      res.status(200).json({ removeCount: result });
    } catch (err) {
      console.log('[err]', err);
      res.status(500).json({ message: err });
    }
  })();
};

const login = (req, res) => {
  res.status(200).end();
};

module.exports = { insert, selectUserByID, selectUsersByName, update, remove, login };

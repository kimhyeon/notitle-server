const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { users } = require('../../models');
const { Op } = require('sequelize');

const sendEmail = reqBody => {
  const { email, pwd, name, age } = reqBody;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmlail.com',
    secure: false,
    port: 587,
    requireTLS: true,
    auth: {
      user: 'zofldnj1@gmail.com',
      pass: 'as141512'
    }
  });

  const mailOptions = {
    from: 'zofldnj1@gmail.com',
    to: email,
    subject: 'certificate email address',
    html: `
      <h2>메일 인증 보내드립니다.</h2>
      <a href="https://expressjs.com/ko/starter/generator.html" target="_blank">https://expressjs.com/ko/starter/generator.html</a>
    `
  };

  // return promise
  return transporter.sendMail(mailOptions);
};

const findDuplicatedUser = email => {
  return users.findAll({
    where: {
      email: email,
      email_certification_flag: 1
    }
  });
};

const saveNewUser = reqBody => {
  const { email, pwd, name } = reqBody;
  const id = uuidv4();

  // return promise
  return users.create({
    id,
    email,
    pwd,
    name
  });
};

const selectUserByID = id => {
  return users.findOne({
    attributes: [
      'id',
      'email',
      'name',
      'profile',
      'profile_back',
      'status_message'
    ],
    where: {
      id: id
    }
  });
};

const selectUsersByName = name => {
  return users.findAll({
    where: {
      name: name
    }
  });
};

const updateUser = (id, body) => {
  let newData = {},
    {
      pwd,
      name,
      profile,
      profile_back,
      status_message,
      email_certification_flag
    } = body;

  pwd && (newData['pwd'] = pwd);
  name && (newData['name'] = name);
  profile && (newData['profile'] = profile);
  profile_back && (newData['profile_back'] = profile_back);
  status_message && (newData['status_message'] = status_message);
  email_certification_flag &&
    (newData['email_certification_flag'] = email_certification_flag);

  return users.update(newData, {
    where: {
      id: id
    }
  });
};

module.exports = {
  sendEmail,
  findDuplicatedUser,
  saveNewUser,
  selectUserByID,
  selectUsersByName,
  updateUser
};

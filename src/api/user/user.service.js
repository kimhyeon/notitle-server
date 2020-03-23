const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { user } = require('../../models');
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
  return user.findAll({
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
  return user.create({
    id,
    email,
    pwd,
    name
  });
};

module.exports = { sendEmail, findDuplicatedUser, saveNewUser };

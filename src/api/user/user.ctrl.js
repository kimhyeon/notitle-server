const nodemailer = require('nodemailer');

const sendEmail = (req, res) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmlail.com",
    secure: false,
    port: 587,
    requireTLS : true,
    auth: {
      user: "zofldnj1@gmail.com",
      pass: "as141512"
    }
  });
  
  const mailOptions = {
    from: "zofldnj1@gmail.com",
    to: "dudu753951@naver.com",
    subject: "certificate email address",
    html: `
      <h2>메일 인증 보내드립니다.</h2>
      <a href="https://expressjs.com/ko/starter/generator.html" target="_blank">https://expressjs.com/ko/starter/generator.html</a>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("mail error", err);
      res.json({ result: err });
    } else {
      console.log("mail success", info.response);
      res.json({ result: 1 });
    }
  });

};

module.exports = { sendEmail };
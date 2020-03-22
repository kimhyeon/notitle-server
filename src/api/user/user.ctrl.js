const nodemailer = require('nodemailer');

const save = (req, res) => {
  if (req.body === {}) return res.status(400).end();

  const { email, pwd, name, age } = req.body;
  if (!email || !pwd || !name || !age) return res.status(400).end();

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

  (async () => {
    try {
      let result = await transporter.sendMail(mailOptions);
      if (result.rejected.length === 0) {
        res.json({ result: 1 });
      } else {
        res.json({ result: -912 });
      }
    } catch (err) {
      console.log(err);
      res.json({ result: -1 });
    }
  })();
};

module.exports = { save };

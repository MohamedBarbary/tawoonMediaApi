const nodemailer = require('nodemailer');

exports.sendMail = async (receiver, mailHtml) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.Sender,
      pass: process.env.App_Password,
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates (not recommended for production)
    },
  });

  const mailOptions = {
    from: 'mohamed <mohamedalbarbary0@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: 'verfiy mail', // Subject line
    text: 'Hello world?', // plain text body
    html: mailHtml, // html body
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('indeeeeed');
  } catch (error) {
    console.log(error.message);
  }
};

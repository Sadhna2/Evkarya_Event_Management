const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendMail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error(' Error sending email:', error);
    throw new Error('Email sending failed');
  }
};

module.exports = { sendMail };

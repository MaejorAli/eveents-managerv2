import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, (err, info) => {
    console.log('ERROR: ', err);
    console.log('ENVELOPE: ', info.envelope);
    console.log('MESSAGE ID: ', info.messageId);
  });
};


const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendEmail(to, subject, text, attachmentPath) {
  let transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro serviço de email
    auth: {
      user: 'kleciohenrique18@gmail.com', // Seu email
      pass: 'wsbk qdhz akpk lrwk' // Sua senha ou senha de aplicativo
    }
  });

  let info = await transporter.sendMail({
    from: 'unicapevents@gmail.com', // Remetente
    to: to, // Destinatário
    subject: subject, // Assunto
    text: text, // Texto do email
    attachments: [
      {
        filename: (attachmentPath.toString()).replace('/tmp/', ''),
        path: attachmentPath
      }
    ]
  });

  console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail;
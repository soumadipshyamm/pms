const mailer = require("nodemailer");
const mailConfig = require("../config").Mail;
var smtpTransport = mailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: false,
  auth: mailConfig.auth,
});
const sendMail = async (email, subject, content, attachments=false) => {
  if (attachments) {
    var mailContent = {
      from: {
        name: mailConfig.fromName,
        address: mailConfig.fromMail,
      },
      to: email,
      subject: subject,
      html: content,
      attachments: [
        {
          filename: "invoice.pdf",
          path: attachments,
        },
      ],
    };
  } else {
    var mailContent = {
      from: {
        name: mailConfig.fromName,
        address: mailConfig.fromMail,
      },
      to: email,
      subject: subject,
      html: content,
    };
  }
  smtpTransport.sendMail(mailContent, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response.response);
    }
  });
};
module.exports = sendMail;

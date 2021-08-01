const nodemailer = require("nodemailer");
const {MailSettings, MailTemplates} = require("../models");

const setMessage = (message, fields) => {
  for (const [key, value] of Object.entries(fields)){
    message = message.replace(key, value)
  }
  return message
}
module.exports = {
  sendMail: async (receiver, template, fields) => {
    let settings = await MailSettings.findOne()
    let message = await MailTemplates.findOne({name: template})
    message.content = setMessage(message.content, fields)

    let transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      auth: {
        user: settings.email,
        pass: settings.password
      }
    });

    return await transporter.sendMail(
      {
        from: '"Meşe Dürüm 👻" <deneme@enginyuksel.kim>',
        to: receiver,
        subject: message.subject,
        html: message.content
      }
    );

  }
};

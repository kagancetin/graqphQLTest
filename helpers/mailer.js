const nodemailer = require("nodemailer");
const { MailSettings } = require("../models");

module.exports = {
  sendResetPasswordMail: async (message, callback) => {
    let settings = await MailSettings.findOne();
    let url = "localhost:3000/login/resetPassword/" + message;

    let transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: false,
      auth: {
        user: settings.email,
        pass: settings.password,
      },
    });
    let info = await transporter.sendMail(
      {
        from: '"Meşe Dürüm 👻" <meşedürüm@kurumsal.com>',
        to: "info@enginyuksel.kim",
        subject: "Meşe Dürüm Şifre Yenileme İsteği",
        html: ` 
        <a href="${url}">Şifrenizi Yenilemek için 2 saat içerisinde bu URL\'i kullanabilirsiniz!</a></br><h3>Afiyet Olsun!</h3>
        `,
      },
      (err, info) => {
        if (err) callback(err, null);
        else callback(null, info);
      },
    );
  },
  sendUserPassword: async (message, receiver, password, callback) => {
    let settings = await MailSettings.findOne();
    let url = "localhost:3000/";

    let transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: false,
      auth: {
        user: settings.email,
        pass: settings.password,
      },
    });
    let info = await transporter.sendMail(
      {
        from: '"Meşe Dürüm 👻" <meşedürüm@kurumsal.com>',
        to: receiver,
        subject: "Meşe Dürüm Yeni Kullanıcı Şifresi",
        html: `
        Aşağıdaki şifreyi kullanarak
        <a href="${url}">Adresinden giriş yapabilirsiniz!</a></br><h3>Afiyet Olsun!</h3>
        Şifreniz:
        ${password}    
        `,
      },
      (err, info) => {
        if (err) callback(err, null);
        else callback(null, info);
      },
    );
  },
};

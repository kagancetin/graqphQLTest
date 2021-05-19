const nodemailer = require("nodemailer");
const { MailSettings } = require("../models");
module.exports = {
  sendResetPasswordMail: async (message, callback) => {
    let settings = await MailSettings.findOne();
    let url = "localhost:3000/login/resetPassword/" + message;

    let transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: settings.email, // generated ethereal user
        pass: settings.password, // generated ethereal password
      },
    });
    let info = await transporter.sendMail(
      {
        from: '"Meşe Dürüm 👻" <meşedürüm@kurumsal.com>', // sender address
        to: "ikagancetin@gmail.com", // list of receivers
        subject: "Meşe Dürüm Şifre Yenileme İsteği", // Subject line
        html: ` 
        <a href="${url}">Şifrenizi Yenilemek için 2 saat içerisinde bu URL\'i kullanabilirsiniz!</a></br><h3>Afiyet Olsun!</h3>
        `,
      },
      (err, info) => {
        if (err) {
          console.log(err);
          callback(err, null);
        } else callback(null, info);
      }
    );
  },
};

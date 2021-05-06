const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Costumer = require("../../models/Costumer");

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne(
        { email },
        { email: 1, password: 1, displayName: 1 },
        (err, user) => {
          if (err) {
            return done("Bir hata oluştu.", null, {});
          }
          if (!user) {
            Costumer.findOne(
              { email },
              { email: 1, password: 1, displayName: 1, phoneNumber: 1 },
              (err, costumer) => {
                if (err) {
                  return done("Bir hata oluştu.", null, {});
                }
                if (!costumer) {
                  return done("Kullanıcı Bulunamadı.", null, {});
                }
                bcrypt.compare(password, costumer.password, (err, res) => {
                  if (res) {
                    const costumerInfo = {
                      _id: costumer._id,
                      email: costumer.email,
                      displayName: costumer.displayName,
                      phoneNumber: costumer.phoneNumber,
                    };
                    return done(null, costumerInfo, {
                      message: "Başarıyla giriş yapıldı.",
                    });
                  } else {
                    return done("Yanlış şifre girdiniz!", false, {});
                  }
                });
              }
            );
          } else {
            bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                const admin = {
                  _id: user._id,
                  email: user.email,
                  admin: true,
                  displayName: user.displayName,
                };
                return done(null, admin, {
                  message: "Başarıyla admin girişi yapıldı.",
                });
              } else {
                return done("Yanlış şifre girdiniz!", false, {});
              }
            });
          }
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

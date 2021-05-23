const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Customer = require("../../models/Customer");

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
            Customer.findOne(
              { email },
              { email: 1, password: 1, displayName: 1, phoneNumber: 1 },
              (err, customer) => {
                if (err) {
                  return done("Bir hata oluştu.", null, {});
                }
                if (!customer) {
                  return done("Kullanıcı Bulunamadı.", null, {});
                }
                bcrypt.compare(password, customer.password, (err, res) => {
                  if (res) {
                    const customerInfo = {
                      _id: customer._id,
                      email: customer.email,
                      displayName: customer.displayName,
                      phoneNumber: customer.phoneNumber,
                    };
                    return done(null, customerInfo, {
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

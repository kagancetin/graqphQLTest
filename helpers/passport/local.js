const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Customer = require("../../models/Customer");
const UserRole = require("../../models/UserRole")

const localOptions = {usernameField: "email", passwordField: "password", passReqToCallback: true}
const successMessage = {message: "Başarıyla admin girişi yapıldı."}
const passwordFail =  "Yanlış şifre girdiniz!"
const usernameFail = "Kullanıcı Bulunamadı!"

const login = async (req, email, password, done) => {
  let user = await User.findOne({ email }, {email: 1, password: 1, displayName: 1, userRole: 1 })
  if (user) {
    if (await bcrypt.compare(password, user.password)){
      let userRole = await UserRole.findById(user.userRole)
      return done(null, {
        _id: user._id,
        email: user.email,
        admin: true,
        displayName: user.displayName,
        userRole: userRole.authorities
      }, successMessage)
    }
    else
      return done(passwordFail, false, {})
    }

  let customer = await Customer.findOne({email},{email: 1, password: 1, displayName: 1, phoneNumber: 1 })
  if (customer) {
    if (await bcrypt.compare(password, customer.password))
      return done(null, {
        _id: customer._id,
        email: customer.email,
        displayName: customer.displayName,
        phoneNumber: customer.phoneNumber
      }, successMessage)
    else
      return done(passwordFail, false, {})
  }
  else
    return done(usernameFail, false, {})
}

passport.use(new localStrategy(localOptions,(req, email, password, done) => { return login(req, email, password, done)}))

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

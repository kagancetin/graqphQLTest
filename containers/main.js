const {User, Customer, Token} = require("../models")
const bcrypt = require("bcryptjs")

const updatePassword = async (userId, hash) => {
  const filter = { _id: userId }
  const user = await User.findOne(filter)
  if (!user){
    const customer = await Customer.findOne(filter)
    if (customer)
      return Customer.findByIdAndUpdate(userId, {$set: {password: hash}})
  }
  else
    return User.findByIdAndUpdate(userId, {$set: {password: hash}})
}

module.exports = {
  createNewPassword: async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.newpassword1, salt)
    const updated = await updatePassword(req.params.id, hash)
    if (!updated){
      req.flash("error", "Şifre Değiştirme Hatası")
      res.redirect("/")
    }
    else {
      await Token.findOneAndRemove({userId: req.params.id})
      req.flash("success", "Şifre Değiştirildi")
      res.redirect("/")
    }
  }
}
const {v4: uuidv4} = require('uuid')
const {Token} = require("../../models")
const mailer = require("../../helpers/mailer")
const {Customer, User} = require("../../models")
const winston = require("winston")

const createToken = async (userId) => {
  const filter = {userId: userId}
  const update = {userId: userId, token: uuidv4()}
  return Token.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true
  })
}

const checkToken = async (token) => {
  return Token.findOne({token})
}
const receiver =  async (id) => {
  const user = await User.findById(id, {email: 1});
  return user.email
}
const isUserExist = async (email) => {
  const filterCustomer = {email, banned: false}
  const filterUser = {email, deleted: false}
  const select = {_id: 1}
  const user = await User.findOne(filterUser, select)
  if (user)
    return user
  return Customer.findOne(filterCustomer, select)
}
module.exports = {
  resetPassword: async (req, res) => {
    let id
    let email
    if (req.route.path === '/forgetPassword') {
      const customer = await isUserExist(req.body.email)
      if (!customer) {
        req.flash("error", "Kullanıcı bulunamadı.");
        res.redirect("/")
      } else{
        id = customer._id
        email = req.body.email
      }

    } else{
      id = req.params.id
      email = await receiver(id)
    }

    const token = await createToken(id)
    await mailer.sendMail(email, "Şifre Resetleme Şablonu", {$$token$$: token.token})
      .then(() => {
        req.flash("success", "Şifre Değiştirme İsteği Gönderildi.")
        res.redirect(req.query.redirect)
      })
      .catch(error => {
        winston.error(JSON.stringify(error))
        req.flash("error", "mail gönderme hatası")
        res.redirect(req.query.redirect)
      })
  },
  rePasswordPage: async (req, res) => {
    const token = await checkToken(req.params.token)
    if (token === null) {
      console.log("baba! token yok")
      req.flash("error", "link geçersiz veya kullanım süresi dolmuştur.")
      res.redirect("/")
    } else res.render("pages/client/resetPassword", {userId: token.userId})

  }
}
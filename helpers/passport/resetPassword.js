const {v4: uuidv4} = require('uuid')
const {Token} = require("../../models")
const mailer = require("../../helpers/mailer")
const {Customer, User} = require("../../models")

const createToken = async (userId) => {
  const filter = {userId: userId}
  const update = {userId: userId, token: uuidv4()}
  return Token.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true
  })
}

const checkToken = async (token) => {
  let date = new Date()
  date.setHours(date.getHours() - 2)
  let currentDate = date.toISOString()
  const filter = {token: token, updatedAt: {$gte: currentDate}}
  return Token.findOne(filter)
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
    if (req.route.path === '/forgetPassword') {
      const customer = await isUserExist(req.body.email)
      if (!customer) {
        req.flash("error", "Kullanıcı bulunamadı.");
        res.redirect("/")
      } else
        id = customer._id
    } else
      id = req.params.id
    const token = await createToken(id)
    await mailer.sendResetPasswordMail(token, (err, info) => {
      if (err)
        req.flash("error", "mail gönderme hatası")
      else
        req.flash("success", "Şifre Değiştirme İsteği Gönderildi.")
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
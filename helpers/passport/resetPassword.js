const { v4: uuidv4 } = require('uuid')
const { Token } = require("../../models")
const  mailer  = require("../../helpers/mailer")

const createToken = async (userId) => {
    const filter = { userId: userId }
    const update = { userId: userId, token: uuidv4()}
    return Token.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true
    })
}

const checkToken = async (token) => {
    let date = new Date()
    date.setHours(date.getHours() - 2)
    let currentDate = date.toISOString()
    const filter = { token: token, updatedAt: { $gte: currentDate} }
    return Token.findOne(filter)
}
module.exports = {
    resetPassword: async (req, res) => {
        createToken(req.params.id).then(async r => {
            await mailer.sendResetPasswordMail(r.token, (err, info) => {
                if (err)
                    req.flash("error", "mail gönderme hatası")
                else
                    req.flash("success", "Şifre Değiştirme İsteği Gönderildi.")
                res.redirect("/admin/costumers")
            })
        })
    },
    rePasswordPage: async (req, res) => {
        checkToken(req.params.token).then(r => {
            if (r === null){
                req.flash("error", "link geçersiz veya kullanım süresi dolmuştur.")
                res.redirect("/")
            }
            else res.render("pages/client/resetPassword", {userId: r.userId})
        })

    }
}
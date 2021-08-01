const {graphql} = require("graphql")
const schema = require("../../graphql/schema")
const generator = require("generate-password")
const mailer = require("../../helpers/mailer")
const {User} = require("../../models")
const bcrypt = require("bcryptjs")
const winston = require("winston")

const generatePassword = () => {
  return generator.generate({
    length: 10,
    numbers: true
  })
}

module.exports = {
  addUser: async (req, res, next) => {
    const password = generatePassword()
    let query = `
    mutation{
      registerUser(
        email: "${req.body.email}"
        password: "${password}"
        displayName: "${req.body.displayName}"
        userRole: "${req.body.roleId}"
      ){
        _id
        email
        displayName
        createdAt
        updatedAt
        deleted
      }
    }
    `
    const results = await graphql(schema, query)
    if (!results.errors) {
      await mailer.sendMail(req.body.email, "Yeni Kullanıcı için Şifre Şablonu", {$$sifre$$: password})
        .then(() => {
          req.flash("success", "Şifre Gönderildi.")
          res.redirect("/admin/users")
        })
        .catch(error => {
          winston.error(JSON.stringify(error))
          req.flash("error", "mail gönderme hatası")
          res.redirect("/admin/users")
        })
    } else {
      req.flash("error", results.errors[0].message)
      res.redirect("/admin/users")
    }
  },
  updateUserOptions: async (req, res) => {
    let options = []
    Object.keys(req.body).map(k => req.body[k] == "on" ? options.push(k) : null)
    let query = `
    mutation{
      updateUser(
        _id:"${req.params.id}",
        options:${JSON.stringify(options)},
      )
    }
    `
    console.log(options)
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors[0].message)
        res.redirect("/admin/profile")
      } else {
        res.locals.admin.options = options
        req.flash("success", result.data.updateUser)
        res.redirect("/admin/profile")
      }
    })
  },
  updateUser: async (req, res, next) => {
    let query = `
    mutation{
      updateUser(
        _id:"${req.params.id}",
        email:"${req.body.email}",
        displayName:"${req.body.displayName}"
        userRole: "${req.body.roleId}"

      )
    }
    `
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors[0].message)
        res.redirect("/admin/users")
      } else {
        req.flash("success", result.data.updateUser)
        res.redirect("/admin/users")
      }
    })
  },
  changeUserPassword: async (req, res, next) => {
    const user = await User.findById(req.params.id).select({password: 1})
    console.log(user)
    await bcrypt.compare(req.body.oldpassword, user.password, (err, response) => {
      if (err){
        req.flash("error", "Sistemde bir hata oluştu lütfen bildiriniz.")
        res.redirect("/admin/settings")
      }
      else {
        if (!response){
          req.flash("error", "Eski Şifreniz uyuşmuyor")
          res.redirect("/admin/settings")
        }
        else {
          bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(req.body.newpassword1, salt).then(async (hash) => {
              User.findByIdAndUpdate(req.params.id, {$set: {password: hash}}, (err, doc) => {
                if (err) {
                  req.flash("error", "Şifre Değiştirme Hatası")
                  res.redirect("/admin/settings")
                } else {
                  req.flash("success", "Şifre Değiştirildi")
                  res.redirect("/admin/settings")
                }
              });

            })
          })
        }
      }

    })

  },
  removeAndRestoreUser: async (req, res, next) => {
    let query = `
    mutation{
      removeAndRestoreUser(_id:"${req.params.id}")
    }
    `
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors[0].message)
        res.redirect("/admin/users")
      } else {
        req.flash("success", result.data.removeAndRestoreUser)
        res.redirect("/admin/users")
      }
    })
  },
  removeFullUser: async (req, res, next) => {
    let query = `
    mutation{
      removeFullUser(
        _id: "${req.params.id}"
      )
    }
    `
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors)
        res.redirect("/admin/users")
      } else {
        req.flash("success", result.data.removeFullUser)
        res.redirect("/admin/users")
      }
    })
  },
  addRole: async (req, res, next) => {
    console.log(req.body)
    let authorities = []
    if (req.body.rol1)
      authorities.push(1)
    if (req.body.rol2)
      authorities.push(2)
    if (req.body.rol3)
      authorities.push(3)
    if (req.body.rol4)
      authorities.push(4)
    let query = `
    mutation{
      addUserRole(
        typeName: "${req.body.roleName}"
        authorities: ${JSON.stringify(authorities)}
      )
    }
    `
    const results = await graphql(schema, query)
    if (!results.errors) {
      req.flash("success", "Rol Eklendi")
      res.redirect("/admin/users")
    } else {
      req.flash("error", results.errors[0].message)
      res.redirect("/admin/users")
    }
  },
  editRole: async (req, res, next) => {
    let query = `
    mutation{
      updateUserRole(
        _id: "${req.params.id}"
        typeName: "${req.body.typeName}"
        authorities: ${JSON.stringify(req.body.authorize)}
      )
    }
    `
    const results = await graphql(schema, query)
    if (!results.errors) {
      req.flash("success", "Rol Düzenlendi")
      res.send({err: null})
    } else {
      res.send({err: "Rol Düzenlenemedi"})
    }
  },
  removeRole: async (req, res, next) => {
    let query = `
    mutation{
      removeUserRole(
        _id: "${req.params.id}"
      )
    }
    `
    const results = await graphql(schema, query)
    if (!results.errors) {
      req.flash("success", "Rol Silindi")
      res.send({err: null})
    } else {
      res.send({err: "Rol Silinemedi"})
    }
  }
}

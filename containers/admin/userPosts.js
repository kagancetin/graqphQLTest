const { graphql } = require("graphql");
const schema = require("../../graphql/schema");
const generator = require("generate-password");
const mailer = require("../../helpers/mailer")

const generatePassword =  () => {
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
        userAuthority: "${req.body.roleId}"
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
    if (!results.errors){
      await mailer.sendUserPassword("mesaj", req.body.email, password, (err, info) => {
        if (err)
          req.flash("error", "mail gönderme hatası")
        else
          req.flash("success", "Şifre Gönderildi.")
        res.redirect("/admin/users")
      })
    }
    else{
      req.flash("error", results.errors[0].message)
      res.redirect("/admin/users")
    }
  },
  updateUser: async (req, res, next) => {
    let query = `
    mutation{
      updateUser(
        _id:"${req.params.id}",
        email:"${req.body.email}",
        displayName:"${req.body.displayName}"
      )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        req.flash("error", result.errors[0].message)
        res.redirect("/admin/users")
      } else {
        req.flash("success", result.data.updateUser)
        res.redirect("/admin/users")
      }
    });
  },
  removeAndRestoreUser: async (req, res, next) => {
    let query = `
    mutation{
      removeAndRestoreUser(_id:"${req.params.id}")
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        req.flash("error", result.errors[0].message);
        res.redirect("/admin/users")
      } else {
        req.flash("success", result.data.removeAndRestoreUser);
        res.redirect("/admin/users")
      }
    });
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
        console.log(result.errors);
        req.flash("error", result.errors);
        res.redirect("/admin/users")
      } else {
        req.flash("success", result.data.removeFullUser);
        res.redirect("/admin/users")
      }
    });
  },
  addRole: async (req, res, next) => {
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
      addUserAuthority(
        typeName: "${req.body.roleName}"
        authorities: ${JSON.stringify(authorities)}
      )
    }
    `
    console.log(query)
    const results = await graphql(schema, query)
    if (!results.errors){
      req.flash("success", "Rol Eklendi")
      res.redirect("/admin/users")
    }
    else{
      req.flash("error", results.errors[0].message)
      res.redirect("/admin/users")
    }
  },
  editRole: async (req, res, next) => {
    let query = `
    mutation{
      updateUserAuthority(
        _id: "${req.params.id}"
        typeName: "${req.body.typeName}"
        authorities: ${JSON.stringify(req.body.authorize)}
      )
    }
    `
    const results = await graphql(schema, query)
    if (!results.errors){
      req.flash("success", "Rol Düzenlendi")
      res.send({err: null})
    }
    else{
      res.send({err: "Rol Düzenlenemedi"})
    }
  },
  removeRole: async (req, res, next) => {
    let query = `
    mutation{
      removeUserAuthority(
        _id: "${req.params.id}"
      )
    }
    `
    const results = await graphql(schema, query)
    if (!results.errors){
      req.flash("success", "Rol Silindi")
      res.send({err: null})
    }
    else{
      res.send({err: "Rol Silinemedi"})
    }
  }
};

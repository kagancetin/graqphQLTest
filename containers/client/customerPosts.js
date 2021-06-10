const { graphql } = require("graphql");
const schema = require("../../graphql/schema");

module.exports = {
  addCustomer: async (req, res, next) => {
    console.log(req.body);
    let query = `
    mutation{
      registerCustomer(
        email: "${req.body.email}"
        password: "${req.body.password}"
        displayName: "${req.body.displayName}"
        phoneNumber: "${req.body.phoneNumber}"
      ){
        _id
        email
        displayName
        createdAt
        updatedAt
        banned
      }
    }
    `;
    const results = await graphql(schema, query);
    console.log(results);
    if (!results.errors) {
      req.flash("success", "Kayıt olundu");
      res.redirect("/");
    } else {
      req.flash("error", results.errors[0].message);
      res.redirect("/");
    }
  },
};

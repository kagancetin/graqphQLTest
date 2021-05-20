const { graphql } = require("graphql");
const schema = require("../../graphql/schema");

module.exports = {
  updateMail: async (req, res, next) => {
    let query = `
    mutation{
      updateMail(
        email: "${req.body.email}"
        password: "${req.body.password}"
        host: "${req.body.host}"
        port: ${req.body.port}
      )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors[0].message)
      } else {
        req.flash("success", result.data.updateMail)
      }
      res.redirect("/admin/settings");
    });
  },
};

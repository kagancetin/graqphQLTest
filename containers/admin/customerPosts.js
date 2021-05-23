const { graphql } = require("graphql");
const schema = require("../../graphql/schema");

module.exports = {
  removeAndRestoreCustomer: async (req, res, next) => {
    let query = `
    mutation{
      removeAndRestoreCustomer(_id:"${req.params.id}")
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors[0].message);
        res.redirect("/admin/customers")
      } else {
        req.flash("success", result.data.removeAndRestoreCustomer);
        res.redirect("/admin/customers")
      }
    });
  },
  removeFullCustomer: async (req, res, next) => {
    let query = `
    mutation{
      removeFullCustomer(
        _id: "${req.params.id}"
      )
    }
    `
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors);
        res.redirect("/admin/customers")
      } else {
        req.flash("success", result.data.removeFullCustomer);
        res.redirect("/admin/customers")
      }
    });
  }
};

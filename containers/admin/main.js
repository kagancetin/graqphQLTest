const { graphql } = require("graphql");
const schema = require("../../graphql/schema");

module.exports = {
  getDashboardPage: async (req, res, next) => {
    res.render("pages/admin/dashboard", { layout: "admin.handlebars" });
  },
  getUsersPage: async (req, res, next) => {
    let query = `
    query{users {
      _id
      email
      displayName
      deleted
      createdAt
      updatedAt
    }}
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(errors);
        req.flash("error", "Bir hata oluştu lütfen hatayı bildiriniz!");
        res.render("pages/admin/users", {
          layout: "admin.handlebars",
        });
      } else {
        console.log(result.data.users[0]);
        res.render("pages/admin/users", {
          layout: "admin.handlebars",
          users: result.data.users,
        });
      }
    });
  },
  getOrdersPage: async (req, res, next) => {
    res.render("pages/admin/orders", { layout: "admin.handlebars" });
  },
  getCostumersPage: async (req, res, next) => {
    res.render("pages/admin/costumers", { layout: "admin.handlebars" });
  },
  getProductsPage: async (req, res, next) => {
    res.render("pages/admin/products", { layout: "admin.handlebars" });
  },
  getSettingsPage: async (req, res, next) => {
    res.render("pages/admin/settings", { layout: "admin.handlebars" });
  },
};

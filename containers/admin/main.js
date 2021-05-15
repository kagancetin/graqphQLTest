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
        res.render("pages/admin/users", {
          layout: "admin.handlebars",
          flashMessages: {
            error: "Bir hata oluştu lütfen hatayı bildiriniz!",
          },
        });
      } else {
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
    let query = `
    query{costumers {
      _id
      email
      displayName
      phoneNumber
      createdAt
      updatedAt
      deleted
    }}
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.render("pages/admin/costumers", {
          layout: "admin.handlebars",
          flashMessages: {
            error: "Bir hata oluştu lütfen hatayı bildiriniz!",
          },
        });
      } else {
        res.render("pages/admin/costumers", {
          layout: "admin.handlebars",
          costumers: result.data.costumers,
        });
      }
    });
  },
  getProductsPage: async (req, res, next) => {
    let query = `
    query{getGroups(_filter:"{\\\"deleted\\\":false}") {
      _id
      groupName
      order
      deleted
      products {
        _id
        productName
        productDescription
        price
        order
        createdAt
        updatedAt
        options {
          _id
          optionName
          deleted
        }
        deleted
      }
    }}
    
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.render("pages/admin/products", {
          layout: "admin.handlebars",
          flashMessages: {
            error: "Bir hata oluştu lütfen hatayı bildiriniz!",
          },
        });
      } else {
        res.render("pages/admin/products", {
          layout: "admin.handlebars",
          groups: result.data.getGroups,
        });
      }
    });
  },
  getProductEditPage: async (req, res, next) => {
    let query = `
    query{
      getProduct(_id:"${req.params.id}") {
        _id
        productName
        productDescription
        price
        order
        createdAt
        updatedAt
        group {
          _id
        }
        options {
          _id
        }
      }
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.render("pages/admin/products", {
          layout: "admin.handlebars",
          flashMessages: {
            error:
              "Bir hata oluştu lütfen tekrar deneyin olmaz ise; hatayı bildiriniz!",
          },
        });
      } else {
        res.render("pages/admin/productEdit", {
          layout: "admin.handlebars",
          product: result.data.getProduct,
        });
      }
    });
  },
  getProductRemovedItemPage: async (req, res, next) => {
    let query = `
    query{
      getGroups(_filter:"{\\"deleted\\":true}") {
        _id
        groupName
      }
      getOptions(_filter:"{\\"deleted\\":true}") {
        _id
        optionName
        optionDisplayName
        optionType
        optionDetail {
          optionDetailContent
          optionPriceDifference
        }
      }
      getProducts(_filter:"{\\"deleted\\":true}") {
        _id
        productName
        productDescription
        price
      }
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.render("pages/admin/products", {
          layout: "admin.handlebars",
          flashMessages: {
            error:
              "Bir hata oluştu lütfen tekrar deneyin olmaz ise; hatayı bildiriniz!",
          },
        });
      } else {
        res.render("pages/admin/productsRemovedItems", {
          layout: "admin.handlebars",
          data: result.data,
        });
      }
    });
  },
  getCostumerDetailPage: async (req, res, next) => {
    res.render("pages/admin/costumerDetail", { layout: "admin.handlebars" });
  },
  getSettingsPage: async (req, res, next) => {
    res.render("pages/admin/settings", { layout: "admin.handlebars" });
  },
};

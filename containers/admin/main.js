const {graphql} = require("graphql");
const schema = require("../../graphql/schema");
const {WorkingHours, Restaurant, MailTemplates} = require("../../models");

const excludeAuthUser = (userId, userList) => userList.filter((user) => user._id != userId);

module.exports = {
  getDashboardPage: async (req, res, next) => {
    res.render("pages/admin/dashboard", {layout: "admin.handlebars"});
  },
  getUsersPage: async (req, res, next) => {
    let query = `
      query {
        users {
          _id
          email
          displayName
          createdAt
          updatedAt
          deleted
          userRole {
            _id
            typeName
            authorities
          }
        }
        userRole {
          _id
          typeName
          authorities
        }
      }
      
          `
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.render("pages/admin/users", {
          layout: "admin.handlebars",
          flashMessages: {
            error: "Bir hata oluştu lütfen hatayı bildiriniz!"
          }
        });
      } else {
        res.render("pages/admin/users", {
          layout: "admin.handlebars",
          users: excludeAuthUser(req.user._id, result.data.users),
          userRole: result.data.userRole
        });
      }
    });
  },
  getUserRoles: async (req, res, next) => {
    let query = `
    query{
      userRole {
        _id
        typeName
        authorities
      }
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!"
        });
      } else {
        res.send({err: null, data: result.data.userRole});
      }
    });
  },
  getOrdersPage: async (req, res, next) => {
    let restaurant = await Restaurant.findOne();
    res.render("pages/admin/orders", {
      layout: "admin.handlebars",
      restaurant: restaurant.toJSON()
    });
  },
  getCustomersPage: async (req, res, next) => {
    let query = `
    query{
      customers {
        _id
        email
        displayName
        phoneNumber
        createdAt
        updatedAt
        banned
      }
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.render("pages/admin/customers", {
          layout: "admin.handlebars",
          flashMessages: {
            error: "Bir hata oluştu lütfen hatayı bildiriniz!"
          }
        });
      } else {
        res.render("pages/admin/customers", {
          layout: "admin.handlebars",
          customers: result.data.customers
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
        open
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
            error: "Bir hata oluştu lütfen hatayı bildiriniz!"
          }
        });
      } else {
        res.render("pages/admin/products", {
          layout: "admin.handlebars",
          groups: result.data.getGroups
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
        open
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
            error: "Bir hata oluştu lütfen tekrar deneyin olmaz ise hatayı bildiriniz!"
          }
        });
      } else {
        res.render("pages/admin/productEdit", {
          layout: "admin.handlebars",
          product: result.data.getProduct
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
            error: "Bir hata oluştu lütfen tekrar deneyin olmaz ise hatayı bildiriniz!"
          }
        });
      } else {
        res.render("pages/admin/productsRemovedItems", {
          layout: "admin.handlebars",
          data: result.data
        });
      }
    });
  },
  getCustomerDetailPage: async (req, res, next) => {
    res.render("pages/admin/customerDetail", {layout: "admin.handlebars"});
  },
  getSettingsPage: async (req, res, next) => {
    let workingHours = await WorkingHours.findOne();
    let mailTemplates = await MailTemplates.find({}).lean()
    let query = `
    query{
      mail{
      email
      password
      host
      port
      }
      districts {
        _id
        name
        limit
        service
      }
      user(filter:{_id:"${req.user._id}"}) {
       _id
       email
       displayName
        userRole {
          _id
          typeName
         }
      }
    }`;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", "Bir hata oluştu lütfen hatayı bildiriniz!");
        res.render("pages/admin/settings", {
          layout: "admin.handlebars"
        });
      } else {
        res.render("pages/admin/settings", {
          layout: "admin.handlebars",
          mail: result.data.mail,
          user: result.data.user,
          districts: result.data.districts,
          workingHours: workingHours.toJSON(),
          mailTemplates: mailTemplates
        });
      }
    });
  },
  getProfilePage: async (req, res, next) => {
    let query = `
    query{
      user(filter:{_id:"${req.user._id}"}) {
       _id
       email
       displayName
       options
        userRole {
          _id
          typeName
         }
      }
    }`;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", "Bir hata oluştu lütfen hatayı bildiriniz!");
        res.render("pages/admin/profile", {
          layout: "admin.handlebars"
        });
      } else {
        res.render("pages/admin/profile", {
          layout: "admin.handlebars",
          user: result.data.user
        });
      }
    });
  }
};

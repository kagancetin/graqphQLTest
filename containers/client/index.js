const { graphql } = require("graphql");
const schema = require("../../graphql/schema");
const {Restaurant} = require("../../models");

module.exports = {
  getIndexPage: async (req, res, next) => {
    res.render("pages/client/index");
  },
  getMenuPage: async (req, res, next) => {
    let restaurant = await Restaurant.findOne();
    let query = `
    query{getGroups(_filter:"{\\"deleted\\":\\"false\\"}") {
      _id
      groupName
      products {
        _id
        productName
        productDescription
        price
        open
        options {
          _id
          optionName
          optionType
          optionDetail{
            optionDetailContent
          optionPriceDifference
          }
          optionDisplayName
        }
      }
    }}
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.render("pages/client/menu", {
          flashMessages: {
            error: "Bir hata oluştu lütfen hatayı bildiriniz!",
          },
        });
      } else {
        res.render("pages/client/menu", {
          groups: result.data.getGroups,
          restaurant: restaurant.toJSON()
        });
      }
    });
  },
  resetPasswordPage: async (req, res, next) => {
    res.render("pages/client/resetPassword");
  },
  profilPage: async (req, res, next) => {
    res.render("pages/client/profil");
  },
  aboutPage: async (req, res, next) => {
    res.render("pages/client/about");
  },
  get404Page: async (req, res, next) => {
    const err = new Error("Not Found");
    res.render("pages/client/404");
  },
};

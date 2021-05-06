const express = require("express");
const router = express.Router();
//*** graphql ***//
const { graphqlHTTP } = require("express-graphql");
const schema = require("../../graphql/schema");
const { graphql } = require("graphql");
//*** graphql ***//
const AdminController = require("../../containers/admin/main");
const { authAdminCheck } = require("../../helpers/passport/authCheck");

//router.use(authAdminCheck);

router.route("/").get(AdminController.getDashboardPage);
router.route("/orders").get(AdminController.getOrdersPage);
router.route("/users").get(AdminController.getUsersPage);
router.route("/costumers").get(AdminController.getCostumersPage);
router.route("/products").get(AdminController.getProductsPage);
router.route("/settings").get(AdminController.getSettingsPage);

router.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

/********* 404 *********/
router.use(async (req, res, next) => {
  const err = new Error("Not Found");
  res.send("404");
});
/********* 404 *********/

module.exports = router;

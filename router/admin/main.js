const express = require("express");
const router = express.Router();
//*** graphql ***//
const { graphqlHTTP } = require("express-graphql");
const schema = require("../../graphql/schema");
const { graphql } = require("graphql");
//*** graphql ***//
const AdminController = require("../../containers/admin/main");
const ProductPostsController = require("../../containers/admin/productPosts");
const { authAdminCheck } = require("../../helpers/passport/authCheck");

//router.use(authAdminCheck);

router.route("/").get(AdminController.getDashboardPage);
router.route("/orders").get(AdminController.getOrdersPage);
router.route("/users").get(AdminController.getUsersPage);
router.route("/costumers").get(AdminController.getCostumersPage);
router.route("/costumer/:id").get(AdminController.getCostumerDetailPage);
router.route("/products").get(AdminController.getProductsPage);
router.route("/product/:id").get(AdminController.getProductEditPage);
router.route("/settings").get(AdminController.getSettingsPage);

router.route("/getGroups").post(ProductPostsController.getGroups);
router.route("/getOptions").post(ProductPostsController.getOptions);

router.route("/addOption").post(ProductPostsController.addOption);
router.route("/editOption").post(ProductPostsController.editOption);
router
  .route("/removeOption")
  .post(ProductPostsController.removeAndRestoreOption);

router.route("/addGroup").post(ProductPostsController.addGroup);
router.route("/editGroup").post(ProductPostsController.editGroup);
router.route("/removeGroup").post(ProductPostsController.removeAndRestoreGroup);

router.route("/addProduct").post(ProductPostsController.addProduct);
router.route("/editProduct").post(ProductPostsController.editProduct);
router.route("/removeProduct").post(ProductPostsController.removeProduct);

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

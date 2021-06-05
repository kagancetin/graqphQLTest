const express = require("express");
const router = express.Router();
//*** graphql ***//
const { graphqlHTTP } = require("express-graphql");
const schema = require("../../graphql/schema");
const { graphql } = require("graphql");
//*** graphql ***//
const AdminController = require("../../containers/admin/main");
const ProductPostsController = require("../../containers/admin/productPosts");
const { roleCheck, authAdminCheck } = require("../../helpers/passport/authCheck");
const Role = require("../../helpers/roles");
const { resetPassword } = require("../../helpers/passport/resetPassword");
const SettingPostController = require("../../containers/admin/settingPosts");
const UserPostsController = require("../../containers/admin/userPosts");
const CustomerPostsController = require("../../containers/admin/customerPosts");
router.use(authAdminCheck);

router.route("/").get(AdminController.getDashboardPage);
router.route("/orders").get(roleCheck(Role.orders), AdminController.getOrdersPage);
router.route("/users").get(roleCheck(Role.users), AdminController.getUsersPage);
router.route("/customers").get(roleCheck(Role.customers), AdminController.getCustomersPage);
router.route("/customer/:id").get(roleCheck(Role.customers), AdminController.getCustomerDetailPage);
router.route("/products").get(roleCheck(Role.products), AdminController.getProductsPage);
router.route("/products/removedItems").get(roleCheck(Role.products), AdminController.getProductRemovedItemPage);
router.route("/product/:id").get(roleCheck(Role.products), AdminController.getProductEditPage);
router.route("/settings").get(AdminController.getSettingsPage);
router.route("/getUserRoles").get(roleCheck(Role.users), AdminController.getUserRoles);

router.route("/getGroups").post(ProductPostsController.getGroups);
router.route("/getOptions").post(ProductPostsController.getOptions);

router.route("/addOption").post(roleCheck(Role.products), ProductPostsController.addOption);
router.route("/editOption").post(roleCheck(Role.products), ProductPostsController.editOption);
router.route("/removeAndRestoreOption").post(roleCheck(Role.products), ProductPostsController.removeAndRestoreOption);
router.route("/removeFullOption").post(roleCheck(Role.products), ProductPostsController.removeFullOption);

router.route("/addGroup").post(roleCheck(Role.products), ProductPostsController.addGroup);
router.route("/editGroup").post(roleCheck(Role.products), ProductPostsController.editGroup);
router.route("/removeAndRestoreGroup").post(roleCheck(Role.products), ProductPostsController.removeAndRestoreGroup);
router.route("/removeFullGroup").post(roleCheck(Role.products), ProductPostsController.removeFullGroup);

router.route("/addProduct").post(roleCheck(Role.products), ProductPostsController.addProduct);
router.route("/editProduct").post(roleCheck(Role.products), ProductPostsController.editProduct);
router.route("/removeProduct").post(roleCheck(Role.products), ProductPostsController.removeProduct);
router.route("/restoreProduct").post(roleCheck(Role.products), ProductPostsController.restoreProduct);
router.route("/removeFullProduct").post(roleCheck(Role.products), ProductPostsController.removeFullProduct);
router.route("/openCloseProduct/:id").post(roleCheck(Role.users), ProductPostsController.openCloseProduct);

router.route("/resetPassword/:id").post(resetPassword);
router.route("/mailUpdate").post(roleCheck(Role.users), SettingPostController.updateMail);

router.route("/addUser").post(roleCheck(Role.users), UserPostsController.addUser);
router.route("/updateUser/:id").post(roleCheck(Role.users), UserPostsController.updateUser);
router.route("/changeUserPassword/:id").post(roleCheck(Role.users), UserPostsController.changeUserPassword);
router.route("/removeFullUser/:id").post(roleCheck(Role.users), UserPostsController.removeFullUser);
router.route("/removeAndRestoreUser/:id").post(roleCheck(Role.users), UserPostsController.removeAndRestoreUser);

router.route("/addRole").post(roleCheck(Role.users), UserPostsController.addRole);
router.route("/editRole/:id").post(roleCheck(Role.users), UserPostsController.editRole);
router.route("/removeRole/:id").post(roleCheck(Role.users), UserPostsController.removeRole);

router.route("/banAndUnbanCustomer/:id").post(roleCheck(Role.customers), CustomerPostsController.banAndUnbanCustomer);
router.route("/removeFullCustomer/:id").post(roleCheck(Role.customers), CustomerPostsController.removeFullCustomer);

router.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

/********* 404 *********/
router.use(async (req, res, next) => {
  const err = new Error("Not Found");
  res.send("404");
});
/********* 404 *********/

module.exports = router;

const express = require("express")
const router = express.Router()
//*** graphql ***//
const {graphqlHTTP} = require("express-graphql")
const schema = require("../../graphql/schema")
const {graphql} = require("graphql")
//*** graphql ***//
const AdminController = require("../../containers/admin/main")
const ProductPostsController = require("../../containers/admin/productPosts")
const {authAdminCheck} = require("../../helpers/passport/authCheck")
const {resetPassword} = require("../../helpers/passport/resetPassword")
const SettingPostController = require("../../containers/admin/settingPosts")
const UserPostsController = require("../../containers/admin/userPosts")
const CustomerPostsController = require("../../containers/admin/customerPosts")
//router.use(authAdminCheck)


router.route("/").get(AdminController.getDashboardPage)
router.route("/orders").get(AdminController.getOrdersPage)
router.route("/users").get(AdminController.getUsersPage)
router.route("/customers").get(AdminController.getCustomersPage)
router.route("/customer/:id").get(AdminController.getCustomerDetailPage)
router.route("/products").get(AdminController.getProductsPage)
router
  .route("/products/removedItems")
  .get(AdminController.getProductRemovedItemPage)
router.route("/product/:id").get(AdminController.getProductEditPage)
router.route("/settings").get(AdminController.getSettingsPage)
router.route("/getUserRoles").get(AdminController.getUserRoles)

router.route("/getGroups").post(ProductPostsController.getGroups)
router.route("/getOptions").post(ProductPostsController.getOptions)

router.route("/addOption").post(ProductPostsController.addOption)
router.route("/editOption").post(ProductPostsController.editOption)
router
  .route("/removeAndRestoreOption")
  .post(ProductPostsController.removeAndRestoreOption)
router.route("/removeFullOption").post(ProductPostsController.removeFullOption)

router.route("/addGroup").post(ProductPostsController.addGroup)
router.route("/editGroup").post(ProductPostsController.editGroup)
router
  .route("/removeAndRestoreGroup")
  .post(ProductPostsController.removeAndRestoreGroup)
router.route("/removeFullGroup").post(ProductPostsController.removeFullGroup)

router.route("/addProduct").post(ProductPostsController.addProduct)
router.route("/editProduct").post(ProductPostsController.editProduct)
router.route("/removeProduct").post(ProductPostsController.removeProduct)
router.route("/restoreProduct").post(ProductPostsController.restoreProduct)
router
  .route("/removeFullProduct")
  .post(ProductPostsController.removeFullProduct)

router.route("/resetPassword/:id").post(resetPassword)
router.route("/mailUpdate").post(SettingPostController.updateMail)

router.route("/addUser").post(UserPostsController.addUser)
router.route("/updateUser/:id").post(UserPostsController.updateUser)
router.route("/removeFullUser/:id").post(UserPostsController.removeFullUser)
router.route("/removeAndRestoreUser/:id").post(UserPostsController.removeAndRestoreUser)

router.route("/addRole").post(UserPostsController.addRole)
router.route("/editRole/:id").post(UserPostsController.editRole)
router.route("/removeRole/:id").post(UserPostsController.removeRole)

router.route("/removeAndRestoreCustomer/:id").post(CustomerPostsController.removeAndRestoreCustomer)
router.route("/removeFullCustomer/:id").post(CustomerPostsController.removeFullCustomer)

router.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

/********* 404 *********/
router.use(async (req, res, next) => {
  const err = new Error("Not Found")
  res.send("404")
})
/********* 404 *********/

module.exports = router

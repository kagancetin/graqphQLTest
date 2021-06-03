const express = require("express");
const router = express.Router();
const ClientController = require("../../containers/client/index");
const CustomerPostsController = require("../../containers/client/customerPosts")
const MainController = require("../../containers/main")
const {resetPassword, rePasswordPage} = require("../../helpers/passport/resetPassword")

router.route("/").get(ClientController.getIndexPage);
router.route("/menu").get(ClientController.getMenuPage);
router.route("/restoran").get(ClientController.aboutPage);
router.route("/yeni-sifre").get(ClientController.resetPasswordPage);
router.route("/ayarlar/:id").get(ClientController.profilPage);

router.route("/registerCustomer").post(CustomerPostsController.addCustomer);
router.route("/forgetPassword").post(resetPassword);
router.route("/resetPassword/:token").get(rePasswordPage)

router.route("/createNewPassword/:id").post(MainController.createNewPassword)
/********* 404 *********/
router.use(ClientController.get404Page);
/********* 404 *********/

module.exports = router;

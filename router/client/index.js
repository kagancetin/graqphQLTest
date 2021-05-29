const express = require("express");
const router = express.Router();
const ClientController = require("../../containers/client/index");

router.route("/").get(ClientController.getIndexPage);
router.route("/menu").get(ClientController.getMenuPage);
router.route("/restoran").get(ClientController.aboutPage);
router.route("/yeni-sifre").get(ClientController.resetPasswordPage);
router.route("/ayarlar/:id").get(ClientController.profilPage);

/********* 404 *********/
router.use(ClientController.get404Page);
/********* 404 *********/

module.exports = router;

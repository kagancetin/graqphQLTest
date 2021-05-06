const express = require("express");
const router = express.Router();
const ClientController = require("../../containers/client/index");

router.route("/").get(ClientController.getIndexPage);

/********* 404 *********/
router.use(async (req, res, next) => {
  const err = new Error("Not Found");
  res.send("404");
});
/********* 404 *********/

module.exports = router;

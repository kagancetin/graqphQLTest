const express = require("express");
const router = express.Router();
const passport = require("passport");

router.route("/").post(async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      req.flash("error", err);
      res.redirect("/")
    } else {
      req.login(user, function (error) {
        if (error) {
          console.log(error);
          req.flash("error", error);
          res.redirect("/")
        } else {
          if (req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 * 2; // Cookie expires after 60 days
          } else {
            req.session.cookie.expires = false; // Cookie expires at end of session
          }
          req.flash("success", info.message);
          res.redirect("/")
        }
      });
    }
  })(req, res, next);

});

router.route("/logout").get(async (req, res, next) => {
  console.log("çıkış yapıyorum")
  req.session.destroy()
  req.logout()
  res.redirect("/");
});


module.exports = router;

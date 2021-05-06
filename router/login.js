const express = require("express");
const router = express.Router();
const passport = require("passport");

router.route("/").post(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email == "") {
    res.send({ err: "Email giriniz!" });
  } else if (password == "") {
    res.send({ err: "Parola giriniz!" });
  } else {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        res.send({ err: err });
      } else {
        req.login(user, function (error) {
          if (error) {
            console.log(error);
            res.send({ err: error });
          } else {
            if (req.body.remember) {
              req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 * 2; // Cookie expires after 60 days
            } else {
              req.session.cookie.expires = false; // Cookie expires at end of session
            }
            req.flash("success", info.message);
            res.send({ err: null });
          }
        });
      }
    })(req, res, next);
  }
});

router.route("/logout").get(async (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

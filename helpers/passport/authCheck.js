module.exports = {
  authCheck: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect(req.originalUrl);
    }
  },
  authAdminCheck: (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
      return next();
    } else {
      return res.redirect("/");
    }
  },
};

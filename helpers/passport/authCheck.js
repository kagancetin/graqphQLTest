const roleCheck = (role) => {
  return (req, res, next) => {
      if (!req.user.userRole.includes(role)){
        req.flash("error", "YETKİNİZ YOK!")
        return res.redirect("/admin")
      }
      next()
    }
}

module.exports = {
  authAdminCheck: (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
      return next();
    } else {
      return res.redirect("/");
    }
  },
  authCheck: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect(req.originalUrl);
    }
  },
  roleCheck
};
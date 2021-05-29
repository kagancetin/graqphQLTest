module.exports = {
  getIndexPage: async (req, res, next) => {
    res.render("pages/client/index");
  },
  getMenuPage: async (req, res, next) => {
    res.render("pages/client/menu");
  },
  resetPasswordPage: async (req, res, next) => {
    res.render("pages/client/resetPassword");
  },
  profilPage: async (req, res, next) => {
    res.render("pages/client/profil");
  },
  aboutPage: async (req, res, next) => {
    res.render("pages/client/about");
  },
  get404Page: async (req, res, next) => {
    const err = new Error("Not Found");
    res.render("pages/client/404");
  },
};

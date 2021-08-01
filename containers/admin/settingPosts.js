const { graphql } = require("graphql");
const schema = require("../../graphql/schema");
const { WorkingHours, MailTemplates } = require("../../models");
const { openCloseRestaurantSchedule } = require("../../helpers/schedule");

module.exports = {
  updateMail: async (req, res, next) => {
    let query = `
    mutation{
      updateMail(
        email: "${req.body.email}"
        password: "${req.body.password}"
        host: "${req.body.host}"
        port: ${req.body.port}
      )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors[0].message);
      } else {
        req.flash("success", result.data.updateMail);
      }
      res.redirect("/admin/settings");
    });
  },
  updateDistrict: async (req, res, next) => {
    let query = `
    mutation{updateDistrict(
      name: "${req.body.district}"
      limit: ${req.body.limit}
      service: ${req.body.service}
    )}
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        req.flash("error", result.errors[0].message);
      } else {
        req.flash("success", result.data.updateDistrict);
      }
      res.redirect("/admin/settings");
    });
  },

  saveWorkingHours: async (req, res, next) => {
    WorkingHours.findByIdAndUpdate(req.params.id, req.body, (err, doc) => {
      if (err) {
        req.flash("error", "Bir hata oluştu lütfen bildiriniz.");
      } else {
        req.flash("success", "Çalışma saatleri başarıyla güncellendi.");
        openCloseRestaurantSchedule(req.params.id);
      }
      res.redirect("/admin/settings");
    });
  },
  saveMailTemplate: async (req, res, next) => {
    MailTemplates.findByIdAndUpdate(req.params.id, req.body, (err, doc) => {
      if (err) {
        req.flash("error", "Bir hata oluştu lütfen bildiriniz.");
      } else {
        req.flash("success", "E-posta şablonları başarıyla güncellendi.");
      }
      res.redirect("/admin/settings");
    });
  }
};

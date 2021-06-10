const { Restaurant } = require("../../models");

module.exports = {
  openCloseRestaurant: async (req, res, next) => {
    await Restaurant.findById(req.params.id, (err, doc) => {
      
      let open = !doc.open;
      console.log(open);
      Restaurant.findByIdAndUpdate(req.params.id, { $set: { open } }, (err, doc) => {
        if (err) {
          console.log(err);
          req.flash("error", "Bir hata olştu lütfen bildiriniz.");
        } else {
          req.flash("success", "Restoran durumu güncellendi");
        }
        console.log("burada");
        res.redirect("/admin/order");
      });
    });
  },
};

const { Product } = require("../models");
const schedule = require("node-schedule");

module.exports = {
  closeProductDaily: (productId) => {
    let job = schedule.scheduleJob(productId, "20 * * * * *", async function () {
      await Product.findByIdAndUpdate(productId, { $set: { open: true } }, (err, doc) => {
        if (err) {
          console.log(err);
        }
      });
      schedule.scheduledJobs[productId].cancel();
    });
  },
};

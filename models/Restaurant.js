const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  open: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("restaurant", restaurantSchema);

const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      set: (e) => parseFloat(e).toFixed(2)
    },
    service: {
      type: Boolean,
      required: true,
      default: false
    }
  }
);

module.exports = mongoose.model("district", districtSchema);

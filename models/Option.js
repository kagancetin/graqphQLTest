const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    optionName: {
      type: String,
      required: true,
    },
    optionDisplayName: {
      type: String,
      required: true,
    },
    optionDetailType: {
      type: Number,
      required: true,
    },
    optionDetailContent: [String],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("option", optionSchema);

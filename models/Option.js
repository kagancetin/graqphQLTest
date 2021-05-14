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
    optionType: {
      type: Number,
      required: true,
    },
    optionDetail: [
      {
        optionDetailContent: String,
        optionPriceDifference: {
          type: Number,
          default: 0,
          get: (e) => {
            return parseFloat(e).toFixed(2);
          },
        },
      },
    ],

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("option", optionSchema);

const mongoose = require("mongoose");

const mailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  }
);

module.exports = mongoose.model("mailTemplate", mailTemplateSchema);

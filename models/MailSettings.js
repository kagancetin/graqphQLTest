const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    host: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model("mailSettings", mailSchema);

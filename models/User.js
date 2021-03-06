const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      select: false,
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
    userRole: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: [],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("user", userSchema)

const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      select: false
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email"
      ]
    },
    displayName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model("customer", customerSchema)

const mongoose = require("mongoose")

const userRoleSchema = new mongoose.Schema(
  {
    typeName: {
      type: String,
      required: true
    },
    authorities: [
      {
        type: Number
      }
    ]
  }
)

module.exports = mongoose.model("userRole", userRoleSchema)

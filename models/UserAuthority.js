const mongoose = require("mongoose");

const userAuthoritySchema = new mongoose.Schema(
  {
    typeName: {
      type: String,
      required: true,
    },
    authorities: [
      {
        type: Number
      }
    ]
  }
);

module.exports = mongoose.model("userAuthority", userAuthoritySchema);

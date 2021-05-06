const mongoose = require("mongoose");

const costumerAddressSchema = new mongoose.Schema({
  costumer_id: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  other: {
    type: String,
    required: true,
  },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("costumerAddress", costumerAddressSchema);

const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
},
{ timestamps: true }
);

tokenSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 7200 })

module.exports = mongoose.model("token", tokenSchema);


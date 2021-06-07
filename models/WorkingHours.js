const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema({
  pazartesiAcilis: {
    type: String,
    default: "08:00",
  },
  pazartesiKapanis: {
    type: String,
    default: "00:00",
  },
  saliAcilis: {
    type: String,
    default: "08:00",
  },
  saliKapanis: {
    type: String,
    default: "00:00",
  },
  carsambaAcilis: {
    type: String,
    default: "08:00",
  },
  carsambaKapanis: {
    type: String,
    default: "00:00",
  },
  persembeAcilis: {
    type: String,
    default: "08:00",
  },
  persembeKapanis: {
    type: String,
    default: "00:00",
  },
  cumaAcilis: {
    type: String,
    default: "08:00",
  },
  cumaKapanis: {
    type: String,
    default: "00:00",
  },
  cumartesiAcilis: {
    type: String,
    default: "08:00",
  },
  cumatesiKapanis: {
    type: String,
    default: "00:00",
  },
  pazarAcilis: {
    type: String,
    default: "08:00",
  },
  pazarKapanis: {
    type: String,
    default: "00:00",
  },
});

module.exports = mongoose.model("workingHours", workingHoursSchema);

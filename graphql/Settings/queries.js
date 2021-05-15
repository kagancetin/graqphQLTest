const { MailSettingsType } = require("../types");
const { MailSettings } = require("../../models");

const mail = {
  type: MailSettingsType,
  description: "Retrieves one mail",
  resolve(parent, args) {
    return MailSettings.findOne();
  },
};

module.exports = { mail };

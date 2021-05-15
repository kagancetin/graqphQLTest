const { MailSettingsType } = require("../types");
const { MailSettings } = require("../../models");
const { GraphQLString, GraphQLInt } = require("graphql");

const updateMail = {
  type: GraphQLString,
  description: "update mail",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    host: { type: GraphQLString },
    port: { type: GraphQLInt }
  },
  async resolve(parent, args) {
    await MailSettings.findOneAndUpdate({}, args, {
      new: true,
      upsert: true
    }, (err, doc) => {
      if (err) throw new Error("Mail kaydetme hatası!");
    })

    return "Mail Güncelleme İşlemi Başarılı"
  },
};

module.exports = {updateMail};

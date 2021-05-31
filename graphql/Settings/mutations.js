const { MailSettings, District } = require("../../models");
const { GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLFloat } = require("graphql");

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

const updateDistrict = {
  type: GraphQLString,
  description: "update District",
  args: {
    name: {type: GraphQLString},
    limit: {type: GraphQLFloat},
    service: {type: GraphQLBoolean}
  },
  async resolve(parent, args) {
    let {name,limit, service} = args
    console.log("args: ", args)
    const dnm = await District.findOneAndUpdate({name: name}, {limit: limit, service: service}, (err, doc) => {
      if (err) throw new Error("District kaydetme hatası!");
    })
    console.log("return: ", dnm)
    return "District Güncelleme İşlemi Başarılı"
  },
};

module.exports = {updateMail, updateDistrict};

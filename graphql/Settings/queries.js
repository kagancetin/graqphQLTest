const { MailSettingsType, DistrictType } = require("../types");
const { MailSettings, District } = require("../../models");
const {
  GraphQLList,
  GraphQLString
} = require("graphql")

const mail = {
  type: MailSettingsType,
  description: "Retrieves one mail",
  resolve(parent, args) {
    return MailSettings.findOne();
  },
};

const district = {
  type: DistrictType,
  description: "Retrieves one district",
  args: {name: {type: GraphQLString}},
  resolve(parent, args) {
    return District.findOne(args)
  }
}

const districts = {
  type: new GraphQLList(DistrictType),
  description: "Retrieves list of districts",
  resolve(parent, args) {
    return District.find({}, null, {sort: {name: 1}})
  }
}

module.exports = { mail, district, districts };

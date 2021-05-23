const {
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLNonNull
} = require("graphql")
const {CustomerAddressType} = require("../types")
const {CustomerAddress} = require("../../models")

const filter = new GraphQLInputObjectType({
  name: "customerAddressFilter",
  fields: {
    customer_id: {type: GraphQLString},
    neighborhood: {type: new GraphQLNonNull(GraphQLString)},
    street: {type: GraphQLString},
    other: {type: GraphQLString},
    deleted: {type: GraphQLBoolean}
  }
})

const customerAddress = {
  type: new GraphQLList(CustomerAddressType),
  description: "Retrieves list of users",
  args: {filter: {type: filter}},
  resolve(parent, args) {
    return CustomerAddress.find(args.filter)
  }
}

module.exports = {customerAddress}

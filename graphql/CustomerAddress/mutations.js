const {CustomerAddressType} = require("../types")
const {CustomerAddress} = require("../../models")
const {GraphQLString} = require("graphql")

const addCustomerAddress = {
  type: CustomerAddressType,
  description: "Adds a customer address",
  args: {
    customer_id: {type: GraphQLString},
    neighborhood: {type: GraphQLString},
    street: {type: GraphQLString},
    other: {type: GraphQLString}
  },
  async resolve(parent, args) {
    const {customer_id, neighborhood, street, other} = args
    const customerAddress = new CustomerAddress({
      customer_id,
      neighborhood,
      street,
      other
    })
    return customerAddress.save()
  }
}

module.exports = {
  addCustomerAddress
}

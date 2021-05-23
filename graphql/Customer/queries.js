const {GraphQLList, GraphQLID} = require("graphql")
const {CustomerType} = require("../types")
const {Customer} = require("../../models")

const customers = {
  type: new GraphQLList(CustomerType),
  description: "Retrieves list of customers",
  resolve(parent, args) {
    return Customer.find()
  }
}

const customer = {
  type: CustomerType,
  description: "Retrieves one customer",
  args: {id: {type: GraphQLID}},
  resolve(parent, args) {
    return Customer.findById(args.id)
  }
}

module.exports = {customers, customer}

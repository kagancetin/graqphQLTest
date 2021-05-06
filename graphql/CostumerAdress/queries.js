const {
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLNonNull,
} = require("graphql");
const { CostumerAdressType } = require("../types");
const { CostumerAdress } = require("../../models");

const filter = new GraphQLInputObjectType({
  name: "costumerAdressesFilter",
  fields: {
    costumer_id: { type: GraphQLString },
    neighborhood: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: GraphQLString },
    other: { type: GraphQLString },
    deleted: { type: GraphQLBoolean },
  },
});

const costumerAdresses = {
  type: new GraphQLList(CostumerAdressType),
  description: "Retrieves list of users",
  args: { filter: { type: filter } },
  resolve(parent, args) {
    return CostumerAdress.find(args.filter);
  },
};

module.exports = { costumerAdresses };

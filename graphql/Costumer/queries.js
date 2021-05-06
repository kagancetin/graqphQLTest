const { GraphQLList, GraphQLID } = require("graphql");
const { CostumerType } = require("../types");
const { Costumer } = require("../../models");

const costumers = {
  type: new GraphQLList(CostumerType),
  description: "Retrieves list of costumers",
  resolve(parent, args) {
    return Costumer.find();
  },
};

const costumer = {
  type: CostumerType,
  description: "Retrieves one costumer",
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return Costumer.findById(args.id);
  },
};

module.exports = { costumers, costumer };

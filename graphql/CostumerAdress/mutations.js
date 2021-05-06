const { CostumerAdressType } = require("../types");
const { CostumerAdress } = require("../../models");
const { GraphQLString } = require("graphql");

const addCostumerAddress = {
  type: CostumerAdressType,
  description: "Register new user",
  args: {
    costumer_id: { type: GraphQLString },
    neighborhood: { type: GraphQLString },
    street: { type: GraphQLString },
    other: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { costumer_id, neighborhood, street, other } = args;
    const costumerAdress = new CostumerAdress({
      costumer_id,
      neighborhood,
      street,
      other,
    });
    return costumerAdress.save();
  },
};

module.exports = {
  addCostumerAddress,
};

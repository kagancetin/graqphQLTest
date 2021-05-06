const { GraphQLList, GraphQLID, GraphQLInputObjectType } = require("graphql");

const { GroupType, ProductType, OptionType } = require("../types");
const { Group, Product, Option } = require("../../models");

const getGroups = {
  type: new GraphQLList(GroupType),
  description: "Retrieves list of groups",
  resolve(parent, args) {
    return Group.find();
  },
};

const getGroup = {
  type: GroupType,
  description: "Retrieves one group by id",
  args: { _id: { type: GraphQLID } },
  resolve(parent, args) {
    return Group.findById(args._id);
  },
};

const getProducts = {
  type: new GraphQLList(ProductType),
  description: "Retrieves list of products",
  resolve(parent, args) {
    return Product.find();
  },
};

const getProduct = {
  type: ProductType,
  description: "Retrieves one product by id",
  args: { _id: { type: GraphQLID } },
  resolve(parent, args) {
    return Product.findById(args._id);
  },
};

const getOptions = {
  type: new GraphQLList(OptionType),
  description: "Retrieves list of groups",
  resolve(parent, args) {
    return Option.find();
  },
};

module.exports = { getGroups, getGroup, getOptions, getProducts, getProduct };

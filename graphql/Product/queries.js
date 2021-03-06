const {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
} = require("graphql");

const { GroupType, ProductType, OptionType } = require("../types");
const { Group, Product, Option } = require("../../models");

const getGroups = {
  type: new GraphQLList(GroupType),
  description: "Retrieves list of groups",
  args: { _filter: { type: GraphQLString } },
  resolve(parent, args) {
    if (args._filter) {
      let _filter = JSON.parse(args._filter);
      return Group.find(_filter).sort("order");
    } else {
      return Group.find().sort("order");
    }
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
  args: { _filter: { type: GraphQLString } },
  resolve(parent, args) {
    if (args._filter) {
      let _filter = JSON.parse(args._filter);
      return Product.find(_filter);
    } else {
      return Product.find();
    }
  },
};

const getProduct = {
  type: ProductType,
  description: "Retrieves one product by id",
  args: { _id: { type: GraphQLID } },
  resolve(parent, args) {
    return Product.findById(args._id).sort("order");
  },
};

const getOptions = {
  type: new GraphQLList(OptionType),
  description: "Retrieves list of groups",
  args: { _filter: { type: GraphQLString } },
  resolve(parent, args) {
    if (args._filter) {
      let _filter = JSON.parse(args._filter);
      return Option.find(_filter);
    } else {
      return Option.find();
    }
  },
};

module.exports = { getGroups, getGroup, getOptions, getProducts, getProduct };

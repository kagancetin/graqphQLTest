const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
} = require("graphql");

const {
  User,
  Costumer,
  CostumerAdress,
  Product,
  Group,
  Option,
} = require("../models");

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    _id: { type: GraphQLID },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deleted: { type: GraphQLBoolean },
  }),
});

const CostumerType = new GraphQLObjectType({
  name: "Costumer",
  description: "Costumer type",
  fields: () => ({
    _id: { type: GraphQLID },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deleted: { type: GraphQLBoolean },
    address: {
      type: new GraphQLList(CostumerAdressType),
      async resolve(parent, args) {
        return CostumerAdress.find({ costumer_id: parent._id });
      },
    },
  }),
});

const CostumerAdressType = new GraphQLObjectType({
  name: "CostumerAdress",
  description: "Costumer Adress type",
  fields: () => ({
    _id: { type: GraphQLID },
    costumer: {
      type: CostumerType,
      resolve(parent, args) {
        return Costumer.findById(parent.costumer_id);
      },
    },
    neighborhood: { type: GraphQLString },
    street: { type: GraphQLString },
    other: { type: GraphQLString },
    deleted: { type: GraphQLBoolean },
  }),
});

const GroupType = new GraphQLObjectType({
  name: "ProductGroup",
  description: "Product Group type",
  fields: () => ({
    _id: { type: GraphQLID },
    groupName: { type: GraphQLString },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({ groupId: parent._id }).sort("order");
      },
    },
    deleted: { type: GraphQLBoolean },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "Product type",
  fields: () => ({
    _id: { type: GraphQLID },
    productName: { type: GraphQLString },
    productDescription: { type: GraphQLString },
    price: { type: GraphQLFloat },
    order: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    group: {
      type: GroupType,
      resolve(parent) {
        return Group.findById(parent.groupId);
      },
    },
    options: {
      type: new GraphQLList(OptionType),
      resolve(parent) {
        return parent.options.map((p) => Option.findById(p));
      },
    },
    deleted: { type: GraphQLBoolean },
  }),
});

const OptionType = new GraphQLObjectType({
  name: "ProductOption",
  description: "Product Option type",
  fields: () => ({
    _id: { type: GraphQLID },
    optionName: { type: GraphQLString },
    optionDisplayName: { type: GraphQLString },
    optionDetailType: { type: GraphQLInt },
    optionDetailContent: {
      type: new GraphQLList(GraphQLString),
    },
    deleted: { type: GraphQLBoolean },
  }),
});

module.exports = {
  UserType,
  CostumerType,
  CostumerAdressType,
  GroupType,
  ProductType,
  OptionType,
};

const {
  GroupType,
  OptionType,
  OptionDetail,
  OptionDetailContent,
} = require("../types");
const { Group, Product, Option } = require("../../models");
const {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLID,
} = require("graphql");

/* INPUT TYPES*/
const OptionDetailContentInput = new GraphQLInputObjectType({
  name: "ProductOptionDetailContentInput",
  fields: () => ({
    optionDetailName: { type: GraphQLString },
  }),
});
const OptionDetailInput = new GraphQLInputObjectType({
  name: "ProductOptionDetailInput",
  fields: () => ({
    optionDetailType: { type: GraphQLInt },
    optionDetailContent: {
      type: new GraphQLList(OptionDetailContentInput),
    },
  }),
});

/* INPUT TYPES*/

let addGroup = {
  type: GraphQLString,
  description: "Add item to Product Group",
  args: {
    groupName: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { groupName } = args;
    const group = new Group({
      groupName,
    });
    await group.save((err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Grup eklendi.";
  },
};

let editGroup = {
  type: GraphQLString,
  description: "Add item to Product Group",
  args: {
    _id: { type: GraphQLID },
    groupName: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { _id, groupName } = args;
    await Group.findByIdAndUpdate(_id, { groupName }, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Grup güncellendi.";
  },
};

let addProduct = {
  type: GraphQLString,
  description: "Add item to Product",
  args: {
    productName: { type: GraphQLString },
    productDescription: { type: GraphQLString },
    price: { type: GraphQLFloat },
    groupId: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
  },
  async resolve(parent, args) {
    const { productName, productDescription, price, groupId, options } = args;
    const product = new Product({
      productName,
      productDescription,
      price,
      groupId,
      options,
    });
    await product.save((err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Ürün eklendi.";
  },
};

let editProduct = {
  type: GraphQLString,
  description: "Add item to Product",
  args: {
    _id: { type: GraphQLID },
    productName: { type: GraphQLString },
    productDescription: { type: GraphQLString },
    price: { type: GraphQLFloat },
    groupId: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
  },
  async resolve(parent, args) {
    const {
      _id,
      productName,
      productDescription,
      price,
      groupId,
      options,
    } = args;
    const product = {
      productName,
      productDescription,
      price,
      groupId,
      options,
    };
    await Product.findByIdAndUpdate(_id, product, (err, doc) => {
      if (err) throw new Error(err);
    });
    return "Ürün güncellendi.";
  },
};

let addOption = {
  type: GraphQLString,
  description: "Add item to Product Option",
  args: {
    optionName: { type: GraphQLString },
    optionDisplayName: { type: GraphQLString },
    optionDetail: {
      type: OptionDetailInput,
    },
  },
  async resolve(parent, args) {
    const { optionName, optionDisplayName, optionDetail } = args;
    const option = new Option({
      optionName,
      optionDisplayName,
      optionDetail,
    });
    await option.save((err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Seçenek eklendi.";
  },
};

let editOption = {
  type: GraphQLString,
  description: "Add item to Product Option",
  args: {
    _id: { type: GraphQLID },
    optionName: { type: GraphQLString },
    optionDisplayName: { type: GraphQLString },
    optionDetail: {
      type: OptionDetailInput,
    },
  },
  async resolve(parent, args) {
    const { _id, optionName, optionDisplayName, optionDetail } = args;
    const option = {
      optionName,
      optionDisplayName,
      optionDetail,
    };
    await Option.findByIdAndUpdate(_id, option, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Seçenek güncellendi.";
  },
};

module.exports = {
  addGroup,
  editGroup,
  addOption,
  editProduct,
  addProduct,
  editOption,
};

const { Group, Product, Option } = require("../../models");
const { GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLInputObjectType, GraphQLID } = require("graphql");

/* INPUT TYPES*/
const OptionDetailInput = new GraphQLInputObjectType({
  name: "ProductOptionDetailInput",
  description: "Product Option Detail Input type",
  fields: () => ({
    optionDetailContent: { type: GraphQLString },
    optionPriceDifference: { type: GraphQLInt },
  }),
});

/* INPUT TYPES*/

const addGroup = {
  type: GraphQLString,
  description: "Add a new Group",
  args: {
    groupName: { type: GraphQLString },
    order: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    const { groupName, order } = args;
    const group = new Group({
      groupName,
      order,
    });
    await group.save((err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Grup eklendi.";
  },
};

const editGroup = {
  type: GraphQLString,
  description: "Edit a Group",
  args: {
    _id: { type: GraphQLID },
    groupName: { type: GraphQLString },
    order: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    const { _id, groupName, order } = args;
    await Group.findByIdAndUpdate(_id, { groupName, order }, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Grup güncellendi.";
  },
};

const removeAndRestoreGroup = {
  type: GraphQLString,
  description: "Remove or restore a Group",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    let group = await Group.findById(_id);
    let isDeleted = !group.deleted;
    await Group.updateOne(
      { _id: group._id },
      {
        $set: {
          deleted: isDeleted,
        },
      },
      (err, doc) => {
        if (err) throw new Error("Bir hata oluştu");
      },
    );
    return "İşlem başarılı.";
  },
};

const addProduct = {
  type: GraphQLString,
  description: "Add a new Product",
  args: {
    productName: { type: GraphQLString },
    productDescription: { type: GraphQLString },
    price: { type: GraphQLFloat },
    order: { type: GraphQLInt },
    groupId: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
  },
  async resolve(parent, args) {
    const { productName, productDescription, price, order, groupId, options } = args;
    const product = new Product({
      productName,
      productDescription,
      price,
      order,
      groupId,
      options,
    });
    await product.save().then((err) => {
      console.log(err);
      if (err) {
        //throw new Error("Bir hata oluştu");
      }
    });
    return "Ürün eklendi.";
  },
};

const editProduct = {
  type: GraphQLString,
  description: "Edit a Product",
  args: {
    _id: { type: GraphQLID },
    productName: { type: GraphQLString },
    productDescription: { type: GraphQLString },
    price: { type: GraphQLFloat },
    order: { type: GraphQLInt },
    groupId: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
  },
  async resolve(parent, args) {
    const { _id, productName, productDescription, price, order, groupId, options } = args;
    const product = {
      productName,
      productDescription,
      price,
      order,
      groupId,
      options,
    };
    await Product.findByIdAndUpdate(_id, product, (err, doc) => {
      if (err) throw new Error(err);
    });
    return "Ürün güncellendi.";
  },
};

const removeProduct = {
  type: GraphQLString,
  description: "Remove a Product",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    await Product.findByIdAndUpdate(
      _id,
      {
        $set: {
          deleted: true,
        },
      },
      (err, doc) => {
        if (err) throw new Error("Bir hata oluştu");
      },
    );
    return "İşlem başarılı.";
  },
};

const restoreProduct = {
  type: GraphQLString,
  description: "Restore a Product",
  args: {
    _id: { type: GraphQLID },
    groupId: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { _id, groupId } = args;
    await Product.findByIdAndUpdate(
      _id,
      {
        $set: {
          groupId,
          options: [],
          deleted: false,
        },
      },
      (err, doc) => {
        if (err) throw new Error("Bir hata oluştu");
      },
    );
    return "İşlem başarılı.";
  },
};

const addOption = {
  type: GraphQLString,
  description: "Add a new Option",
  args: {
    optionName: { type: GraphQLString },
    optionDisplayName: { type: GraphQLString },
    optionType: { type: GraphQLInt },
    optionDetail: {
      type: new GraphQLList(OptionDetailInput),
    },
  },
  async resolve(parent, args) {
    const { optionName, optionDisplayName, optionType, optionDetail } = args;
    const option = new Option({
      optionName,
      optionDisplayName,
      optionType,
      optionDetail,
    });
    await option.save((err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Seçenek eklendi.";
  },
};

const editOption = {
  type: GraphQLString,
  description: "Edit a Option",
  args: {
    _id: { type: GraphQLID },
    optionName: { type: GraphQLString },
    optionDisplayName: { type: GraphQLString },
    optionType: { type: GraphQLInt },
    optionDetail: {
      type: new GraphQLList(OptionDetailInput),
    },
  },
  async resolve(parent, args) {
    const { _id, optionName, optionDisplayName, optionType, optionDetail } = args;
    const option = {
      optionName,
      optionDisplayName,
      optionType,
      optionDetail,
    };
    await Option.findByIdAndUpdate(_id, option, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "Seçenek güncellendi.";
  },
};

const removeAndRestoreOption = {
  type: GraphQLString,
  description: "Add item to Product Option",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    let option = await Option.findById(_id);
    let redata = !option.deleted;
    await Option.updateOne(
      { _id: option._id },
      {
        $set: {
          deleted: redata,
        },
      },
      (err, doc) => {
        if (err) throw new Error("Bir hata oluştu");
      },
    );
    return "İşlem başarılı.";
  },
};

const removeFullOption = {
  type: GraphQLString,
  description: "Permanently removes a Option",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    await Option.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "İşlem başarılı.";
  },
};

const removeFullProduct = {
  type: GraphQLString,
  description: "Permanently removes a Product",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    await Product.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "İşlem başarılı.";
  },
};

const removeFullGroup = {
  type: GraphQLString,
  description: "Permanently removes a Group",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    await Group.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "İşlem başarılı.";
  },
};

module.exports = {
  addGroup,
  editGroup,
  removeAndRestoreGroup,
  addOption,
  editProduct,
  removeProduct,
  restoreProduct,
  addProduct,
  editOption,
  removeAndRestoreOption,
  removeFullOption,
  removeFullGroup,
  removeFullProduct,
};

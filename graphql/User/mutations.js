const bcrypt = require("bcryptjs");

const { UserType } = require("../types");
const { User, UserAuthority } = require("../../models");
const { GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = require("graphql");


const registerUser = {
  type: UserType,
  description: "Register new user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
    userAuthority: {type: GraphQLString}
  },
  async resolve(parent, args) {
    const { email, password, displayName, userAuthority } = args;
    let checkEmail = await User.findOne({ email: email });
    if (checkEmail) throw new Error("E-mail adresi kullanılmaktadır!");
    let checkAuthority = await UserAuthority.findOne({ _id: userAuthority });
    if (!checkAuthority) throw new Error("Böyle bir kullanıcı rolu yoktur!");
    return bcrypt.genSalt(10).then((salt) => {
      return bcrypt.hash(password, salt).then(async (hash) => {
        const user = new User({ email, password: hash, displayName, userAuthority });
        return user.save();
      });
    });
  },
};
const addUserAuthority = {
  type: GraphQLString,
  description: "Add new UserAuthority Type",
  args: {
    typeName: { type: GraphQLString },
    authorities: { type: new GraphQLList(GraphQLInt) }
  },
  async resolve(parent, args) {
    const userAuthority = new UserAuthority(args);
    await userAuthority.save((err, doc) => {
      if (err) throw new Error("Hata")
    })
    return "Kullanıcı Tipi oluşturuldu "
  },
};

const updateUserAuthority = {
  type: GraphQLString,
  description: "Updates a Role",
  args: {
    _id: { type: GraphQLString },
    typeName: { type: GraphQLString },
    authorities: { type: new GraphQLList(GraphQLInt) }
  },
  async resolve(parent, args) {
    const { _id, typeName, authorities } = args;
    let userAuthority = await UserAuthority.findById(_id)
    userAuthority.typeName = typeName
    userAuthority.authorities = authorities
    await userAuthority.save((err, doc) => {
      if (err) throw new Error("Rol bilgileri güncellenemedi.");
    })
    return "İşlem Başarılı"
  },
};

removeUserAuthority = {
  type: GraphQLString,
  description: "Removes  a User Role",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    let isRoleUsing = await User.findOne({ userAuthority: { _id: _id} });
    if (isRoleUsing) throw new Error("Bu rol bir kullanıcı tarafından kullanıldığı için SİLİNEMEZ!");
    await UserAuthority.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "İşlem başarılı.";
  },
};

const updateUser = {
  type: GraphQLString,
  description: "Update a User",
  args: {
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
    userAuthority: {type: GraphQLString}
  },
  async resolve(parent, args) {
    const { _id, email, displayName, userAuthority } = args;
    let user = await User.findById(_id)
    if (user.email != email){
      let checkEmail = await User.findOne({ email: email });
      if (checkEmail) throw new Error("E-mail adresi kullanılmaktadır!");
    }
    user.email = email
    user.displayName = displayName
    user.userAuthority = userAuthority
    await user.save((err, doc) => {
      if (err) throw new Error("Kullanıcı bilgileri güncellenemedi.");
    })
    return "İşlem Başarılı"
  },
};

removeAndRestoreUser = {
  type: GraphQLString,
  description: "Remove or restore User",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    let user = await User.findById(_id);
    let isDeleted = !user.deleted;
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          deleted: isDeleted,
        },
      },
      (err, doc) => {
        if (err) throw new Error("Bir hata oluştu");
      }
    );
    return "İşlem başarılı.";
  },
}

removeFullUser = {
  type: GraphQLString,
  description: "Permanently Removes  a User",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args;
    await User.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu");
    });
    return "İşlem başarılı.";
  },
};
module.exports = {
  registerUser,
  updateUser,
  removeFullUser,
  removeAndRestoreUser,
  addUserAuthority,
  updateUserAuthority,
  removeUserAuthority
};

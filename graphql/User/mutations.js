const bcrypt = require("bcryptjs");

const { UserType } = require("../types");
const { User } = require("../../models");
const { GraphQLString } = require("graphql");

const registerUser = {
  type: UserType,
  description: "Register new user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { email, password, displayName } = args;
    let checkEmail = await User.findOne({ email: email });
    if (checkEmail) throw new Error("E-mail adresi kullanılmaktadır!");
    return bcrypt.genSalt(10).then((salt) => {
      return bcrypt.hash(password, salt).then(async (hash) => {
        const user = new User({ email, password: hash, displayName });
        return user.save();
      });
    });
  },
};

const updateUser = {
  type: UserType,
  description: "Register new user",
  args: {
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { _id, email, displayName } = args;
    let checkEmail = await User.findOne({ email: email });
    if (checkEmail) throw new Error("E-mail adresi kullanılmaktadır!");
    User.findByIdAndUpdate(
      { _id },
      { email, displayName },
      { new: true },
      (err, doc) => {
        if (err) throw new Error("Kullanıcı bilgileri güncellenemedi.");
        return { doc };
      }
    );
  },
};

module.exports = {
  registerUser,
  updateUser,
};

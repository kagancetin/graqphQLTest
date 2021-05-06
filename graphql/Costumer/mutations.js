const { Costumer } = require("../../models");
const { CostumerType } = require("../types");
const { GraphQLString } = require("graphql");
const bcrypt = require("bcryptjs");

const registerCostumer = {
  type: CostumerType,
  description: "Register new user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { phoneNumber, email, password, displayName } = args;
    let checkEmail = await Costumer.findOne({ email: email });
    if (checkEmail) throw new Error("E-mail adresi kullanılmaktadır!");

    return bcrypt.genSalt(10).then((salt) => {
      return bcrypt.hash(password, salt).then(async (hash) => {
        const costumer = new Costumer({
          email,
          password: hash,
          displayName,
          phoneNumber,
        });
        return costumer.save();
      });
    });
  },
};

module.exports = {
  registerCostumer,
};

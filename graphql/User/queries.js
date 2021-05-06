const {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLString,
} = require("graphql");
const { UserType } = require("../types");
const { User } = require("../../models");

const filter = new GraphQLInputObjectType({
  name: "userFilter",
  description: "Filter user by id, email and deleted",
  fields: {
    _id: { type: GraphQLID },
    email: { type: GraphQLString },
    deleted: { type: GraphQLBoolean },
  },
});

const users = {
  type: new GraphQLList(UserType),
  description: "Retrieves list of users",
  resolve(parent, args) {
    return User.find();
  },
};

const user = {
  type: UserType,
  description: "Retrieves one user",
  args: { filter: { type: filter } },
  resolve(parent, args) {
    return User.findOne(args.filter);
  },
};

module.exports = { users, user };

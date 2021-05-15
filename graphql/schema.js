// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

// Import queries
const { mail} = require("./Settings/queries");
const { users, user } = require("./User/queries");
const { costumers, costumer } = require("./Costumer/queries");
const { costumerAdresses } = require("./CostumerAdress/queries");
const {
  getGroups,
  getGroup,
  getOptions,
  getProducts,
  getProduct,
} = require("./Product/queries");
// Import mutations
const { updateMail} = require("./Settings/mutations");
const { registerUser, updateUser } = require("./User/mutations");
const { registerCostumer } = require("./Costumer/mutations");
const { addCostumerAddress } = require("./CostumerAdress/mutations");
const {
  addGroup,
  editGroup,
  removeAndRestoreGroup,
  addProduct,
  editProduct,
  removeProduct,
  restoreProduct,
  addOption,
  editOption,
  removeAndRestoreOption,
  removeFullOption,
  removeFullGroup,
  removeFullProduct,
} = require("./Product/mutations");

// Define QueryType

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: {
    users,
    user,
    mail,
    costumers,
    costumer,
    costumerAdresses,
    getGroups,
    getGroup,
    getOptions,
    getProducts,
    getProduct,
  },
});

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
    registerUser,
    updateUser,
    updateMail,
    registerCostumer,
    addCostumerAddress,
    addGroup,
    editGroup,
    removeAndRestoreGroup,
    addProduct,
    editProduct,
    removeProduct,
    restoreProduct,
    addOption,
    editOption,
    removeAndRestoreOption,
    removeFullOption,
    removeFullGroup,
    removeFullProduct,
  },
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

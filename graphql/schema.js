// Import required stuff from graphql
const {GraphQLSchema, GraphQLObjectType} = require("graphql")

// Import queries
const {mail} = require("./Settings/queries")
const {users, user, userRole} = require("./User/queries")
const {customers, customer} = require("./Customer/queries")
const {customerAddress} = require("./CustomerAddress/queries")
const {
  getGroups,
  getGroup,
  getOptions,
  getProducts,
  getProduct
} = require("./Product/queries")
// Import mutations
const {updateMail} = require("./Settings/mutations")
const {
  registerUser,
  updateUser,
  removeFullUser,
  removeAndRestoreUser,
  addUserRole,
  updateUserRole,
  removeUserRole
} = require("./User/mutations")
const {registerCustomer, removeAndRestoreCustomer, removeFullCustomer} = require("./Customer/mutations")
const {addCustomerAddress} = require("./CustomerAddress/mutations")
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
  removeFullProduct
} = require("./Product/mutations")

// Define QueryType

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: {
    users,
    user,
    userRole,
    mail,
    customers,
    customer,
    customerAddress,
    getGroups,
    getGroup,
    getOptions,
    getProducts,
    getProduct
  }
})

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
    registerUser,
    updateUser,
    removeFullUser,
    removeAndRestoreUser,
    addUserRole,
    updateUserRole,
    removeUserRole,
    updateMail,
    registerCustomer,
    removeAndRestoreCustomer,
    removeFullCustomer,
    addCustomerAddress,
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
    removeFullProduct
  }
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})

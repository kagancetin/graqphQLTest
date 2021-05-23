const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt
} = require("graphql")

const {
  User,
  Customer,
  CustomerAddress,
  Product,
  Group,
  Option,
  MailSettings,
  UserRole
} = require("../models")

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    _id: {type: GraphQLID},
    email: {type: GraphQLString},
    displayName: {type: GraphQLString},
    userRole: {
      type: UserRoleType,
      resolve(parent, args) {
        return UserRole.findById(parent.userRole)
      }
    },
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
    deleted: {type: GraphQLBoolean}
  })
})
const UserRoleType = new GraphQLObjectType({
  name: "userRoleType",
  description: "userRole Type",
  fields: () => ({
    _id: {type: GraphQLID},
    typeName: {type: GraphQLString},
    authorities: {type: new GraphQLList(GraphQLInt)},
    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        return User.find({userType: parent._id})
      }
    }
  })
})
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  description: "Customer type",
  fields: () => ({
    _id: {type: GraphQLID},
    email: {type: GraphQLString},
    displayName: {type: GraphQLString},
    phoneNumber: {type: GraphQLString},
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
    banned: {type: GraphQLBoolean},
    address: {
      type: new GraphQLList(CustomerAddressType),
      async resolve(parent, args) {
        return CustomerAddress.find({customer_id: parent._id})
      }
    }
  })
})

const CustomerAddressType = new GraphQLObjectType({
  name: "CustomerAddress",
  description: "Customer Address type",
  fields: () => ({
    _id: {type: GraphQLID},
    customer: {
      type: CustomerType,
      resolve(parent, args) {
        return Customer.findById(parent.customer_id)
      }
    },
    neighborhood: {type: GraphQLString},
    street: {type: GraphQLString},
    other: {type: GraphQLString},
    deleted: {type: GraphQLBoolean}
  })
})

const GroupType = new GraphQLObjectType({
  name: "ProductGroup",
  description: "Product Group type",
  fields: () => ({
    _id: {type: GraphQLID},
    groupName: {type: GraphQLString},
    order: {type: GraphQLInt},
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({groupId: parent._id, deleted: false}).sort(
          "order"
        )
      }
    },
    deleted: {type: GraphQLBoolean}
  })
})

const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "Product type",
  fields: () => ({
    _id: {type: GraphQLID},
    productName: {type: GraphQLString},
    productDescription: {type: GraphQLString},
    price: {type: GraphQLFloat},
    order: {type: GraphQLInt},
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
    group: {
      type: GroupType,
      resolve(parent) {
        return Group.findById(parent.groupId)
      }
    },
    options: {
      type: new GraphQLList(OptionType),
      resolve(parent) {
        return parent.options.map((p) => Option.findById(p))
      }
    },
    deleted: {type: GraphQLBoolean}
  })
})

const OptionDetail = new GraphQLObjectType({
  name: "ProductOptionDetail",
  description: "Product Option Detail type",
  fields: () => ({
    optionDetailContent: {type: GraphQLString},
    optionPriceDifference: {type: GraphQLInt}
  })
})

const OptionType = new GraphQLObjectType({
  name: "ProductOption",
  description: "Product Option type",
  fields: () => ({
    _id: {type: GraphQLID},
    optionName: {type: GraphQLString},
    optionDisplayName: {type: GraphQLString},
    optionType: {type: GraphQLInt},
    optionDetail: {
      type: new GraphQLList(OptionDetail)
    },
    deleted: {type: GraphQLBoolean}
  })
})

const MailSettingsType = new GraphQLObjectType({
  name: "MailSettings",
  description: "Mail Settings type",
  fields: () => ({
    _id: {type: GraphQLID},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    host: {type: GraphQLString},
    port: {type: GraphQLInt},
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString}
  })
})
module.exports = {
  UserType,
  UserRoleType,
  CustomerType,
  CustomerAddressType,
  GroupType,
  ProductType,
  OptionType,
  MailSettingsType
}

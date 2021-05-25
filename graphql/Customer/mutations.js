const {Customer, CustomerAddress} = require("../../models")
const {CustomerType} = require("../types")
const {GraphQLString, GraphQLID} = require("graphql")
const bcrypt = require("bcryptjs");

const registerCustomer = {
  type: CustomerType,
  description: "Register new Customer",
  args: {
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    displayName: {type: GraphQLString},
    phoneNumber: {type: GraphQLString}
  },
  async resolve(parent, args) {
    const {phoneNumber, email, password, displayName} = args
    let checkEmail = await Customer.findOne({email: email})
    if (checkEmail) throw new Error("E-mail adresi kullanılmaktadır!")

    return bcrypt.genSalt(10).then((salt) => {
      return bcrypt.hash(password, salt).then(async (hash) => {
        const customer = new Customer({
          email,
          password: hash,
          displayName,
          phoneNumber
        })
        return customer.save()
      })
    })
  }
}

const banAndUnbanCustomer = {
  type: GraphQLString,
  description: "Ban or Unban a Customer",
  args: {
    _id: {type: GraphQLID}
  },
  async resolve(parent, args) {
    const {_id} = args
    let customer = await Customer.findById(_id)
    let isBanned = !customer.banned
    await Customer.updateOne(
      {_id: customer._id},
      {
        $set: {
          banned: isBanned
        }
      },
      (err, doc) => {
        if (err) throw new Error("Bir hata oluştu")
      }
    )
    return "İşlem başarılı."
  }
}

const removeFullCustomer = {
  type: GraphQLString,
  description: "Permanently Removes  a Customer",
  args: {
    _id: {type: GraphQLID}
  },
  async resolve(parent, args) {
    const {_id} = args

    await CustomerAddress.deleteMany({customer_id: _id}, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu")
    })
    await Customer.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu")
    })
    return "İşlem başarılı."
  }
}

module.exports = {
  registerCustomer,
  removeFullCustomer,
  banAndUnbanCustomer
}

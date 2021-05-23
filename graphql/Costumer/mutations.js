const { Costumer, CostumerAdress } = require("../../models")
const { CostumerType } = require("../types")
const { GraphQLString, GraphQLID } = require("graphql")

registerCostumer = {
  type: CostumerType,
  description: "Register new Customer",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
    phoneNumber: { type: GraphQLString }
  },
  async resolve(parent, args) {
    const { phoneNumber, email, password, displayName } = args
    let checkEmail = await Costumer.findOne({ email: email })
    if (checkEmail) throw new Error("E-mail adresi kullanılmaktadır!")

    return bcrypt.genSalt(10).then((salt) => {
      return bcrypt.hash(password, salt).then(async (hash) => {
        const costumer = new Costumer({
          email,
          password: hash,
          displayName,
          phoneNumber
        })
        return costumer.save()
      })
    })
  }
}

removeAndRestoreCustomer = {
  type: GraphQLString,
  description: "Remove or restore User",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args
    let customer = await Costumer.findById(_id)
    let isDeleted = !customer.deleted
    await Costumer.updateOne(
      { _id: customer._id },
      {
        $set: {
          deleted: isDeleted,
        }
      },
      (err, doc) => {
        if (err) throw new Error("Bir hata oluştu")
      }
    )
    return "İşlem başarılı."
  }
}

removeFullCustomer = {
  type: GraphQLString,
  description: "Permanently Removes  a Customer",
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    const { _id } = args

    await CostumerAdress.deleteMany({costumer_id: _id}, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu")
    })
    await Costumer.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu")
    })
    return "İşlem başarılı."
  }
}

module.exports = {
  registerCostumer,
  removeFullCustomer,
  removeAndRestoreCustomer
}

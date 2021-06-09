const bcrypt = require("bcryptjs")

const {UserType} = require("../types")
const {User, UserRole} = require("../../models")
const {GraphQLString, GraphQLID, GraphQLList, GraphQLInt} = require("graphql")


const registerUser = {
  type: UserType,
  description: "Register a new user",
  args: {
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    displayName: {type: GraphQLString},
    userRole: {type: GraphQLString}
  },
  async resolve(parent, args) {
    const {email, password, displayName, userRole} = args
    let checkEmail = await User.findOne({email: email})
    if (checkEmail) throw new Error("E-mail adresi kullanılmaktadır!")
    let checkAuthority = await UserRole.findOne({_id: userRole})
    if (!checkAuthority) throw new Error("Böyle bir kullanıcı rolu yoktur!")
    return bcrypt.genSalt(10).then((salt) => {
      return bcrypt.hash(password, salt).then(async (hash) => {
        const user = new User({email, password: hash, displayName, userRole})
        return user.save()
      })
    })
  }
}
const addUserRole = {
  type: GraphQLString,
  description: "Adds a new UserRole",
  args: {
    typeName: {type: GraphQLString},
    authorities: {type: new GraphQLList(GraphQLInt)}
  },
  async resolve(parent, args) {
    const userRole = new UserRole(args)
    await userRole.save((err, doc) => {
      if (err) throw new Error("Hata")
    })
    return "Kullanıcı Tipi oluşturuldu "
  }
}

const updateUserRole = {
  type: GraphQLString,
  description: "Updates a UserRole",
  args: {
    _id: {type: GraphQLString},
    typeName: {type: GraphQLString},
    authorities: {type: new GraphQLList(GraphQLInt)}
  },
  async resolve(parent, args) {
    const {_id, typeName, authorities} = args
    let userRole = await UserRole.findById(_id)
    userRole.typeName = typeName
    userRole.authorities = authorities
    await userRole.save((err, doc) => {
      if (err) throw new Error("Rol bilgileri güncellenemedi.")
    })
    return "İşlem Başarılı"
  }
}

const removeUserRole = {
  type: GraphQLString,
  description: "Removes a User Role",
  args: {
    _id: {type: GraphQLID}
  },
  async resolve(parent, args) {
    const {_id} = args
    let isRoleUsing = await User.findOne({userRole: {_id: _id}})
    if (isRoleUsing) throw new Error("Bu rol bir kullanıcı tarafından kullanıldığı için SİLİNEMEZ!")
    await UserRole.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu")
    })
    return "İşlem başarılı."
  }
}

const updateUser = {
  type: GraphQLString,
  description: "Update a User",
  args: {
    _id: {type: GraphQLString},
    email: {type: GraphQLString},
    displayName: {type: GraphQLString},
    userRole: {type: GraphQLString},
    options: {type: new GraphQLList(GraphQLString)}
  },
  resolve: async function (parent, args) {
    const {_id, email} = args
    Object.keys(args).map(k => args[k] == "undefined" ? delete args[k] : null);
    let user = await User.findById(_id, {email: 1})
    if (user.email != email)
      if (await User.findOne({email: email})) throw new Error("E-mail adresi kullanılmaktadır!")
    const update = await User.findByIdAndUpdate(_id, args, {omitUndefined: true})
    if (!update) throw new Error("Kullanıcı bilgileri güncellenemedi.")
    return "İşlem Başarılı"
  }
}

const removeAndRestoreUser = {
  type: GraphQLString,
  description: "Remove or restore User",
  args: {
    _id: {type: GraphQLID}
  },
  async resolve(parent, args) {
    const {_id} = args
    let user = await User.findById(_id)
    let isDeleted = !user.deleted
    await User.updateOne(
      {_id: user._id},
      {
        $set: {
          deleted: isDeleted
        }
      },
      (err, doc) => {
        if (err) throw new Error("Bir hata oluştu")
      }
    )
    return "İşlem başarılı."
  }
}

const removeFullUser = {
  type: GraphQLString,
  description: "Permanently Removes a User",
  args: {
    _id: {type: GraphQLID}
  },
  async resolve(parent, args) {
    const {_id} = args
    await User.findByIdAndRemove(_id, (err, doc) => {
      if (err) throw new Error("Bir hata oluştu")
    })
    return "İşlem başarılı."
  }
}
module.exports = {
  registerUser,
  updateUser,
  removeFullUser,
  removeAndRestoreUser,
  addUserRole,
  updateUserRole,
  removeUserRole
}

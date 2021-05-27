const mongoose = require("mongoose");
const {graphql} = require("graphql");
const {User, UserRole} = require("../models")
const schema = require("../graphql/schema")

const connectDB = async () => {
  const conn = await mongoose.connect("mongodb://localhost:27017/mesedurum", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log(`MongoDB connected`);
  if (await User.countDocuments() == 0){
    const userRole = await defaultUserRole()
    const user = await defaultUser(userRole._id)
    if (user.errors)
      console.log("default kullanıcı oluşturma hatası")
  }
};
const defaultUserRole = async () => {
  const userRole = new UserRole({typeName: "superAdmin", authorities: [1, 2, 3, 4]})
  return await userRole.save()
}
const defaultUser = async (id) => {
  let query = `
    mutation{
      registerUser(
        email: "deneme@enginyuksel.kim"
        password: "1"
        displayName: "admin"
        userRole: "${id}"
      ){
        _id
        email
        displayName
        createdAt
        updatedAt
        deleted
      }
    }
    `
  return await graphql(schema, query)

}
module.exports = { connectDB };

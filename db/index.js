const mongoose = require("mongoose");
const {graphql} = require("graphql");
const {User, UserRole, District} = require("../models")
const schema = require("../graphql/schema")
const mongoURI = "mongodb://localhost:27017/mesedurum"
const districts = [
  {name: "Bahçelievler", limit: 19.99, service: false},
  {name: "Geriş", limit: 19.99, service: false},
  {name: "Hacıahmet", limit: 19.99, service: false},
  {name: "İskele", limit: 19.99, service: false},
  {name: "Kocacami", limit: 19.99, service: false},
  {name: "Mahkeme", limit: 19.99, service: false},
  {name: "Memiş", limit: 19.99, service: false},
  {name: "Öğretmenler", limit: 19.99, service: false},
  {name: "Ören", limit: 19.99, service: false},
  {name: "Yunus", limit: 19.99, service: false}
]
const connectDB = async () => {
  const conn = await mongoose.connect(mongoURI, {
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
  if (await District.countDocuments() == 0)
     addDistricts()
  return mongoose.connection.getClient()
};
const defaultUserRole = async () => {
  const userRole = new UserRole({typeName: "superAdmin", authorities: [1, 2, 3, 4]})
  return await userRole.save()
}

const addDistricts = async () => {
  return District.insertMany(districts)
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

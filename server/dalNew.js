// DAL = Data Abstraction Layer
// ** Keeps index.js independent of what DB is used **
// This DAL is specific to MongoDB
const mongoose = require("mongoose");
const models = require("./schema/userSchema");
const colors = require("colors");

const url = process.env.MONGO_URI;
const User = models.User;

// let db = null;
// Connect to MongoDB
// MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
//   console.log("Connected to MongoDB!!");

//   // Connect to my db created in mongo_test.js
//   const dbName = "tiered-bad-bank";
//   db = client.db(dbName);
// });

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    console.log("connectDB()");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    console.error("connectDB Error", colors.red(err.message));
    //TODO:Throw Error
  }

  mongoose.connection.on("error", (err) => {
    console.error("mongoose connection Error", err.message);
    //TODO:Handle Error (Tell user? Try to Reconnect? Throw Error?)
  });
};

// Asynchronous bc do NOT know when server will receive it and respond

/////////////////////////////////////////////////
// Create a User Account
/////////////////////////////////////////////////
function createUser({ name, email, password }) {
  console.log("createUser()");
  const newUser = new User({
    name,
    email,
    password,
    balance: 0,
    transactions: [],
  });
  newUser.id = newUser._id;

  console.log("newUser", newUser);

  return new Promise((resolve, reject) => {
    newUser.save((err) => {
      err ? reject(err) : resolve(newUser);
    });
  });
}

/////////////////////////////////////////////////
// Get User By ID
/////////////////////////////////////////////////
function getUser(id) {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      err ? reject(err) : resolve(user);
    });
  });
}

/////////////////////////////////////////////////
// Get User By Email
/////////////////////////////////////////////////
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, user) => {
      err ? reject(err) : resolve(user);
    });
  });
}
/////////////////////////////////////////////////
// Get All Users
/////////////////////////////////////////////////
function getAllUsers() {
  return new Promise((resolve, reject) => {
    User.find((err, users) => {
      err ? reject(err) : resolve(users);
    });
  });
}

/////////////////////////////////////////////////
// Update User
/////////////////////////////////////////////////
function updateUser(id, balance, transactions) {
  //TODO: Generate ID for New Transaction
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, { balance, transactions }, (err, result) => {
      console.log("updateUser result:", result);
      err ? reject(err) : resolve(result);
    });
  });
}

/////////////////////////////////////////////////
// Update User Balance
/////////////////////////////////////////////////
// export function updateBalance(balance) {
//     return new Promise((resolve, reject) => {
//       User.updateOne({ balance: balance }, (err, result) => {
//         console.log("updateBalance result:", result);
//         err ? reject(err) : resolve(result);
//       });
//     });
//   }

/////////////////////////////////////////////////
// Delete User
/////////////////////////////////////////////////
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    User.findByIdAndRemove(id, (err, userDoc) => {
      err ? reject(err) : resolve(userDoc);
    });
  });
}

module.exports = {
  connectDB,
  createUser,
  getUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
};

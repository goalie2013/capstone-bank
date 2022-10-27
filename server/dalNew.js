// DAL = Data Abstraction Layer
// ** Keeps index.js independent of what DB is used **
// This DAL is specific to MongoDB
import { User } from "./schema/userSchema";
const mongoose = require("mongoose");
const models = require("./schema/userSchema");
const colors = require("colors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// const User = models.User;

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
    const conn = await mongoose.connect(process.env.MONGO_ATLAS, {
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    console.error("connectDB Error", colors.red(err.message));
    //TODO:Throw Error
    throw new Error("Error connecting to Database");
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
  console.log(typeof User);
  // Generate Salt
  const salt = bcrypt.genSaltSync(saltRounds);
  // Hash Password
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    name,
    email,
    password: hash,
    balance: 0,
    transactions: [],
  });
  newUser.id = newUser._id;

  console.log("newUser", newUser);
  console.log(typeof newUser);

  return new Promise((resolve, reject) => {
    // newUser.save((err) => {
    //   err ? reject(err) : resolve(newUser);
    // });
    newUser
      .save()
      .then((user) => resolve(user))
      .catch((err) => reject(err));
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
// Login User
/////////////////////////////////////////////////
//TODO:
async function loginUser(email, password = "") {
  console.log("loginUser FUNCTION");
  const user = await getUserByEmail(email);
  const hash = user.password;
  const originalUser = { ...user, password };

  return new Promise((resolve, reject) => {
    if (password && hash && bcrypt.compareSync(password, hash))
      resolve(originalUser);
    reject("User Not Found");
  });
}

/////////////////////////////////////////////////
// Update User
/////////////////////////////////////////////////
function updateUser(id, balance, transactions) {
  //TODO: Generate ID for each new Transaction
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
  loginUser,
  updateUser,
  deleteUser,
};

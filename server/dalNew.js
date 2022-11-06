// DAL = Data Abstraction Layer
// ** Keeps index.js independent of what DB is used **
// This DAL is specific to MongoDB
const mongoose = require("mongoose");
const { User } = require("./schema/userSchema");
const { RefreshToken } = require("./schema/refreshtokenSchema");
const colors = require("colors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const connectDB = async () => {
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
    throw new Error("Error connecting to Database");
  }

  mongoose.connection.on("error", (err) => {
    console.error("mongoose connection Error", err.message);
    //TODO:Handle Error (Tell user? Try to Reconnect? Throw Error?)
  });
};

///////////////////////////////////////////////////////
// Get & Add Refresh Token
///////////////////////////////////////////////////////
function getAllRefreshTokens() {
  return new Promise((resolve, reject) => {
    RefreshToken.find((err, tokens) => {
      err ? reject(err) : resolve(tokens);
    });
  });
}
function addRefreshToken(token, tokenList) {
  console.log("addRefreshToken FUNCTION");
  console.log(tokenList[0]["id"]);

  return new Promise((resolve, reject) => {
    RefreshToken.findByIdAndUpdate(
      tokenList[0]["id"],
      { tokens: [...tokenList[0]["tokens"], token] },
      (err, result) => {
        console.log("addRefreshToken result:", result);
        err ? reject(err) : resolve(result);
      }
    );
  });

  // return new Promise((resolve, reject) => {
  //   newToken
  //     .save()
  //     .then((result) => resolve(result))
  //     .catch((err) => reject(err));
  // });
}

///////////////////////////////////////////////////////
// Create a User Account
// Note: Google Sign In users will NOT have a password
///////////////////////////////////////////////////////
function createUser({ name, email, password = "" }) {
  console.log("createUser()");
  console.log(typeof User);
  let newUser;
  // Generate Salt
  const salt = bcrypt.genSaltSync(saltRounds);
  // Hash Password
  if (password) {
    const hash = bcrypt.hashSync(password, salt);
    newUser = new User({
      name,
      email,
      password: hash,
      balance: 0,
      transactions: [],
    });
  } else {
    newUser = new User({
      name,
      email,
      balance: 0,
      transactions: [],
    });
  }
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

///////////////////////////////////////////////////////
// Get User By ID
///////////////////////////////////////////////////////
function getUser(id) {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      err ? reject(err) : resolve(user);
    });
  });
}

///////////////////////////////////////////////////////
// Get User By Email
///////////////////////////////////////////////////////
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, user) => {
      err ? reject(err) : resolve(user);
    });
  });
}
///////////////////////////////////////////////////////
// Get All Users
///////////////////////////////////////////////////////
function getAllUsers() {
  return new Promise((resolve, reject) => {
    User.find((err, users) => {
      err ? reject(err) : resolve(users);
    });
  });
}

///////////////////////////////////////////////////////
// Login User
///////////////////////////////////////////////////////
// DONT NEED BC FIREBASE AUTH HANDLES LOGIN

///////////////////////////////////////////////////////
// Update User
///////////////////////////////////////////////////////
function updateUser(id, balance, transactions) {
  //TODO: Generate ID for each new Transaction
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, { balance, transactions }, (err, result) => {
      console.log("updateUser result:", result);
      err ? reject(err) : resolve(result);
    });
  });
}

///////////////////////////////////////////////////////
// Delete User
///////////////////////////////////////////////////////
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    User.findByIdAndRemove(id, (err, userDoc) => {
      err ? reject(err) : resolve(userDoc);
    });
  });
}

module.exports = {
  getAllRefreshTokens,
  addRefreshToken,
  connectDB,
  createUser,
  getUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
};

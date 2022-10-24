// DAL = Data Abstraction Layer
// ** Keeps index.js independent of what DB is used **
// This DAL is specific to MongoDB

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
// const url = process.env.MONGO_URI
let db = null;

// Connect to MongoDB
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  console.log("Connected to MongoDB!!");

  // Connect to my db created in mongo_test.js
  const dbName = "tiered-bad-bank";
  db = client.db(dbName);
});

/////////////////////////////////////////////////
// Create a User Account
/////////////////////////////////////////////////
// Asynchronous bc do NOT know when server will receive it and respond
function createUser(name, email, password) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0 };
    collection.insertOne(doc, { w: 1 }, (err, result) => {
      err ? reject(err) : resolve(doc);
    });
  });
}

/////////////////////////////////////////////////
// Get All Users
/////////////////////////////////////////////////
function getAllUsers() {
  return new Promise((resolve, reject) => {
    // try {
    (async () => {
      try {
        const docs = await db.collection("users").find({}).toArray();
        // console.log("docs", docs);
        resolve(docs);
      } catch (err) {
        console.log("err", err);
        reject(err);
      }
    })();
    // } catch (err) {
    //   console.log("err", err);
    //   reject(err);
    // }
  });
}

module.exports = { createUser, getAllUsers };

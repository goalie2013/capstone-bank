const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

// const { initializeApp } = require("firebase-admin/app");
// initializeApp({
//   credential: applicationDefault(),
//   databaseURL: process.env.MONGO_URI,
// });

// idToken comes from the client app
// getAuth()
//   .verifyIdToken(idToken)
//   .then((decodedToken) => {
//     const uid = decodedToken.uid;
//     console.log("uid", uid);
//   })
//   .catch((error) => {
//     // Handle error
//   });

// var admin = require("firebase-admin");
// var serviceAccount = require("path/to/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

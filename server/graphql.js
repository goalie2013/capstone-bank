require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const dal = require("./dalNew");
const bodyParser = require("body-parser");
const { schema, root } = require("./schema/graphqlSchema");
const { initializeApp } = require("firebase-admin/app");
initializeApp({
  // credential: applicationDefault(),
  // databaseURL: process.env.MONGO_URI,
});
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

const app = express();
// CORS FOR DEVELOPMENT ONLY
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

const port = process.env.PORT;
console.log("port", port);

// Connect to Database
dal.connectDB();

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: process.env.NODE_ENV === "development" || "development",
    schema: schema,
    rootValue: root,
  })
);

app.listen(port, () => console.log(`Server running on port ${port}`));

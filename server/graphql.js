// DEVELOPMENT ONLY
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const dal = require("./dalNew");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { verifyTokenExists } = require("./authServer");
// const middleware = require("./middleware/auth");
const { schema, root } = require("./schema/graphqlSchema");
const port = process.env.PORT;
console.log("port", port);

const app = express();
// CORS FOR DEVELOPMENT ONLY
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// app.use(middleware.decodeToken);
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Create & Send JWT Token on Login
app.post("/login", (req, res) => {
  // Authenticated user
  // const user = req.body.user;
  const user = req.body;
  if (!user) res.sendStatus(400);

  jwt.sign(
    user,
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) return res.send(err.message);
      res.json({ token });
    }
  );
});

app.post("/transaction", verifyTokenExists, (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "User Authorized...",
        data,
      });
    }
  });
});

// Connect to Database
try {
  dal.connectDB();
} catch (err) {
  if (err.message === "Error connecting to Database") {
    res.status(500).send("500 Internal Server Error");
  }
}

app.use(
  "/graphql",
  // authenticateToken,
  graphqlHTTP({
    graphiql: process.env.NODE_ENV === "development" || "development",
    schema: schema,
    rootValue: root,
  })
);

app.listen(port || 5000, () => console.log(`Server running on port ${port}`));

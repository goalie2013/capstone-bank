// DEVELOPMENT ONLY
// require("dotenv").config();
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

const generateToken = (user, secret, expiresInNum) => {
  return jwt.sign(
    user,
    process.env.secret,
    { expiresIn: expiresInNum },
    (err, token) => {
      if (err) return res.send(err.message);
      console.log(`new ${secret}`, token);
    }
  );
};
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
  console.log("/login user data", user);
  if (!user) res.sendStatus(400);

  const accessToken = generateToken(user, TOKEN_SECRET, 1800);

  const refreshToken = generateToken(user, REFRESH__SECRET, "1h");

  res.json({ accessToken, refreshToken });
});

app.post("/authorize", verifyTokenExists, (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, (err, data) => {
    if (err) {
      console.error("ERROR /authorize", err.message);
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

app.listen(process.env.PORT || 5000, "0.0.0.0", () =>
  console.log(`My Server running on port ${process.env.PORT}`)
);

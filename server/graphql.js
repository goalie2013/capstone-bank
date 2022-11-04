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

  const accessToken = jwt.sign(
    user,
    process.env.TOKEN_SECRET,
    { expiresIn: 60 * 30 },
    (err, token) => {
      if (err) return res.send(err.message);
      console.log("new access token", token);
    }
  );

  const refreshToken = jwt.sign(
    user,
    process.env.REFRESH_SECRET,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) return res.send("refresh Token Error:", err.message);
      console.log("new refresh token", token);
    }
  );

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
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

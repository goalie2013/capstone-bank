// DEVELOPMENT ONLY
// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const dal = require("./dalNew");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
// const middleware = require("./middleware/auth");
const { schema, root } = require("./schema/graphqlSchema");
const port = process.env.PORT;
console.log("port", port);

const app = express();
// CORS FOR DEVELOPMENT ONLY
// app.use(cors());

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
  const user = req.body.user;
  if (!user) res.sendStatus(400);

  const jwtToken = jwt.sign(user, process.env.TOKEN_SECRET, (err, token) => {
    res.json({ token: jwtToken });
  });
});

// Get JWT, Verify it, and return user
function authenticateToken(req, res, next) {
  // get token from "Bearer TOKEN" header
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader && authHeader.split(" ")[1];

  if (jwtToken === null) return res.sendStatus(401);

  jwt.verify(jwtToken, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    // Token Valid!!
    // req.user = user;
    console.log("decoded", decoded);
    next();
  });
}

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
  authenticateToken,
  graphqlHTTP({
    graphiql: process.env.NODE_ENV === "development" || "development",
    schema: schema,
    rootValue: root,
  })
);

app.listen(port || 5000, () => console.log(`Server running on port ${port}`));

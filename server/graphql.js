// DEVELOPMENT ONLY
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const dal = require("./dalNew");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { verifyTokenExists, generateToken } = require("./authServer");
const { takeScreenshot } = require("./puppeteer");
const puppeteer = require("puppeteer");
// const { executablePath } = require("puppeteer-core");

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

// Connect to Database
try {
  dal.connectDB();
} catch (err) {
  if (err.message === "Error connecting to Database") {
    res.status(500).send("500 Internal Server Error");
  }
}

// Create & Send JWT Token on Login
app.post("/login", async (req, res) => {
  // Authenticated user
  // const user = req.body.user;
  const user = req.body;
  console.log("/login user data", user);
  if (!user) res.sendStatus(400);

  const accessToken = generateToken(user, process.env.TOKEN_SECRET, 60 * 15);
  const refreshToken = generateToken(user, process.env.REFRESH_SECRET, "2h");

  console.log("accessToken", accessToken);
  console.log("refreshToken", typeof refreshToken, refreshToken);

  try {
    const tokenList = await dal.getAllRefreshTokens();
    const result = await dal.addRefreshToken(refreshToken, tokenList);
    console.log("addRefreshToken result", result);
  } catch (err) {
    console.error("addRefreshToken Error:", err.message);
  }

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// Authorize user by checking valid JWT Access Token
app.post("/authorize", verifyTokenExists, (req, res) => {
  console.log("/authorize req.token", req.token);
  if (req.token == null) res.sendStatus(401);

  jwt.verify(req.token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("ERROR /authorize", err.message);
      // Invalid/Expired JWT --> Log Uesr Out
      if (err.messagage === "jwt malformed ") return res.sendStatus(403);
      res.sendStatus(401);
    } else {
      console.log("/authorize data", user);
      res.json({
        message: "User Authorized...",
        user,
      });
    }
  });
});

// If no Access Token --> Check if Refresh Token Exists -->
// Use Refresh Token to create new Access Token
app.post("/newaccesstoken", async (req, res) => {
  console.log("/newaccesstoken");
  const refreshToken = req.body.token;
  const tokenObj = await dal.getAllRefreshTokens();
  // console.log("/newtoken tokenObj", tokenObj);

  const tokenList = tokenObj[0]["tokens"];

  console.log("/newaccesstoken refreshToken", refreshToken);
  console.log();
  console.log(
    "/newaccesstoken tokenList[-1]",
    tokenList[tokenList.length - 1],
    "\n"
  );

  if (refreshToken == null) return res.sendStatus(401);
  if (!tokenList.includes(refreshToken)) {
    console.log("Refresh Token NOT in Token List");
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(403);
    }
    console.log("/newaccesstoken user: ", user);
    const accessToken = generateToken(
      { id: user.id, name: user.name, email: user.email },
      process.env.TOKEN_SECRET,
      60 * 30
    );
    res.json({ accessToken });
  });
});

app.get("/screenshot", (req, res) => {
  const { id, date, type } = req.query;
  console.log("req.query", req.query);
  takeScreenshot(id, date, type, res);
});

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

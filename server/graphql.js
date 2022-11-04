// DEVELOPMENT ONLY
// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const dal = require("./dalNew");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { verifyTokenExists, generateToken } = require("./authServer");
const { takeScreenshot } = require("./puppeteer");
const puppeteer = require("puppeteer-core");
const { executablePath } = require("puppeteer-core");

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

  const accessToken = generateToken(user, process.env.TOKEN_SECRET, 60 * 30);

  const refreshToken = generateToken(user, process.env.REFRESH_SECRET, "1h");

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
      res.sendStatus(403);
    } else {
      console.log("/authorize data", user);
      res.json({
        message: "User Authorized...",
        user,
      });
    }
  });
});

// Use Refresh Token to create new Access Token
app.post("/newtoken", async (req, res) => {
  console.log("/newtoken");
  const refreshToken = req.body.token;
  const tokenObj = await dal.getAllRefreshTokens();
  // console.log("/newtoken tokenObj", tokenObj);

  const tokenList = tokenObj[0]["tokens"];

  console.log("/newtoken refreshToken", refreshToken);
  console.log("/newtoken tokenList[-1]", tokenList[tokenList.length - 1]);

  if (refreshToken == null) return res.sendStatus(401);
  if (!tokenList.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log("/newtoken user: ", user);
    const accessToken = generateToken(
      { id: user.id, name: user.name, email: user.email },
      process.env.TOKEN_SECRET,
      60 * 30
    );
    res.json({ accessToken });
  });
});

app.get("/screenshot", (req, res) => {
  const { id, date, type } = req.body;
  (async () => {
    try {
      const browser = await puppeteer.launch({
        executablePath: executablePath(),
      });
      const page = await browser.newPage();
      await page.goto(`https://betterbankingapp.net/deposit/${id}`);
      await page.emulateMediaType("screen");
      const pdf = await page.pdf({
        path: `${type}${date}.pdf`,
        format: "Letter",
        margin: {
          top: "20px",
          bottom: "40px",
          left: "20px",
          right: "20px",
        },
      });
      res.send(pdf);
      await browser.close();
    } catch (err) {
      res.sendStatus(503);
    }
  })();
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

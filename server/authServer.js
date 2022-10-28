const express = require("express");
// const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
// const middleware = require("./middleware/auth");
const port = process.env.SERVER_PORT;
console.log("port", port);

const app = express();
// CORS FOR DEVELOPMENT ONLY
// app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Create & Send JWT Token on Login
app.post("/login", (req, res) => {
  // Authenticated user
  const user = req.body.user;

  const jwtToken = jwt.sign(user, process.env.TOKEN_SECRET);
  res.json({ token: jwtToken });
});

// Get JWT, Verify it, and return user
function authenticateToken(req, res, next) {
  // get token from "Bearer TOKEN" header
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader && authHeader.split(" ")[1];

  if (jwtToken === null) return res.sendStatus(401);

  jwt.verify(jwtToken, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    // Token Valid!!
    // req.user = user;
    console.log("user", user);
    next();
  });
}

app.listen(port || 4001, () => console.log(`Server running on port ${port}`));

const express = require("express");
// const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
// const middleware = require("./middleware/auth");
// const port = process.env.SERVER_PORT;
// console.log("port", port);

const app = express();
// CORS FOR DEVELOPMENT ONLY
// app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// app.listen(port || 4001, () => console.log(`Server running on port ${port}`));

// Get JWT, Verify it, and return user
function verifyTokenExists(req, res, next) {
  // get token from "Bearer TOKEN" header
  const authHeader = req.headers["authorization"];
  console.log("authHeader", authHeader);
  const jwtToken = authHeader && authHeader.split(" ")[1];
  console.log("jwtToken", jwtToken, typeof jwtToken);

  if (jwtToken == "null") {
    console.log("verifyTokenExists Should return 401");
    return res.sendStatus(401);
  }

  // Token Valid!!
  req.token = jwtToken;
  next();
}

function generateToken(user, secret, expiresInValue) {
  return jwt.sign(user, secret, { expiresIn: expiresInValue });

  // (err, token) => {
  //   if (err) return res.send(err.message);
  //   console.log("new access token", token);
  // }
}

module.exports = { verifyTokenExists, generateToken };

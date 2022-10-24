const express = require("express");
const app = express();
const { userRoutes } = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongo = require("./dal");
const dotenv = require("dotenv");

dotenv.config();

// CORS FOR DEVELOPMENT ONLY
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to MongoDB

app.get("/", (req, res) => {
  res.send("Hello Express");
});

// app.use("/api/users");

// Create User
app.get("/account/create/:name/:email/:password", async (req, res) => {
  /* Using Promises Syntax 
  mongo.createUser(req.params.name,
    req.params.email,
    req.params.password).then(user => {
      console.log(user);
      res.send(user)
    }).catch(err => console.log(err))
  */

  /* Using Async/Await Syntax */
  try {
    const newUser = await mongo.createUser(
      req.params.name,
      req.params.email,
      req.params.password
    );
    console.log("newUser", newUser);
    res.send(newUser);
  } catch (err) {
    console.log("Error on create User:", err);
    //TODO:
  }
});

// Get All Users
app.get("/account/all", async (req, res) => {
  try {
    const allUsers = await mongo.getAllUsers();
    console.log("allUsers", allUsers);
    res.send(allUsers);
  } catch (err) {
    console.log("Error on get all Users:", err);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, console.log(`Server running on Port ${PORT}`));

// Another way to use CORS for DEVELOPMENT
// in client's package.json:
// "proxy": "http://127.0.0.1:5000",

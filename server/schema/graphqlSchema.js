const { buildSchema } = require("graphql");
const dal = require("../dalNew");
const colors = require("colors");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

const schema = buildSchema(`

    type Query {
        getUser(id: ID!): User
        getUserByEmail(email: String!): User
        getAllUsers: [User]
    }

    type Transaction {
        id: ID
        info: String
        timeStamp: String
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String
        balance: Int
        transactions: [Transaction]
    }

    input TransactionInput {
        info: String
        timeStamp: String
    }
    input UserInfo {
        name: String!
        email: String!
        password: String
    }

    input UserData {
        balance: Int!
        transactions: [TransactionInput]!
    }

    type Mutation {
        createUser(user: UserInfo!): User
        updateUser(id: ID!, userData: UserData!): User
        deleteUser(id: ID!): String
        loginUser(email: String!, password: String): User
    }
`);
// createUser(name: String, email: String): [User]
// createUser(user: UserInfo!): User
// updateBalance(user: UserInput!): User
//updateTransactions(user: UserInput!): User

const root = {
  getUser: async ({ id }) => {
    try {
      const user = await dal.getUser(id);
      console.log("fetched user by id", user);
      return user;
    } catch (err) {
      console.error("Error getUser", colors.red(err.message));
    }
  },
  getUserByEmail: async ({ email }) => {
    try {
      const user = await dal.getUserByEmail(email);
      console.log("fetched user by email", user);
      return user;
    } catch (err) {
      console.error("Error getUserByEmail", colors.red(err.message));
    }
  },
  getAllUsers: async () => {
    try {
      const allUsers = await dal.getAllUsers();
      return allUsers;
    } catch (err) {
      console.error("Error", err.message);
    }
  },
  ////////////////////////////////////////////////////////////////////////
  // Mutations
  createUser: async (args) => {
    // console.log(args.user);
    // return user;
    try {
      // const hash = await new Promise((resolve, reject) => {
      //   bcrypt.hash(args.user.password, saltRounds, (err, hash) => {
      //     if (err) reject(err);
      //     resolve(hash);
      //   });
      // });
      // const user = await dal.createUser(args.user, hash);
      const user = await dal.createUser(args.user);
      console.log("returning user...", user);
      return user;
    } catch (err) {
      console.error("Error", colors.red(err.message));
    }
  },
  updateUser: async (args) => {
    console.log(args);
    const { id } = args;
    const { balance, transactions } = args.userData;
    try {
      const updatedUser = await dal.updateUser(id, balance, transactions);
      return updatedUser;
    } catch (err) {
      console.error("Error", err.message);
    }
  },
  deleteUser: async (args) => {
    const { id } = args;
    try {
      const user = await dal.deleteUser(id);
      return `Successfully Deleted Account of ${user.name}`;
    } catch (err) {
      console.error("Error", err.message);
    }
  },
  // loginUser: async ({ email, password }) => {
  //   try {
  //     const user = await dal.loginUser(email, password);
  //     console.log("Logged In User", user);
  //     return user;
  //   } catch (err) {
  //     console.error("Error logging in user", colors.red(err.message));
  //   }
  // },
};

module.exports = { schema, root };

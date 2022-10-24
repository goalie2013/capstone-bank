const { buildSchema } = require("graphql");
const dal = require("../dalNew");
const colors = require("colors");

const schema = buildSchema(`

    type Query {
        getUser(id: ID!): User
        getUserByEmail(email: String!): User
        getAllUsers: [User]
        getPostsFromAPI: [Post]
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

    type Post {
        userId: Int
        id: Int
        title: String
        body: String
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
  //   getPostsFromAPI: async () => {
  //     const url = "https://jsonplaceholder.typicode.com/posts";
  //     const result = axios.get(url);
  //     return result.data;
  //   },
  ////////////////////////////////////////////////////////////////////////
  // Mutations
  createUser: async (args) => {
    // console.log(args.user);
    // return user;
    try {
      const user = await dal.createUser(args.user);
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
};

module.exports = { schema, root };

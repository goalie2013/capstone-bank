// gql QUERIES the DB; syntax just like the GraphiQL tool
import { gql } from "@apollo/client";

const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      name
      balance
      transactions {
        info
        timeStamp
      }
    }
  }
`;

const GET_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
      name
      email
    }
  }
`;

const GET_ALL_USERS = gql`
  {
    getAllUsers {
      name
      email
    }
  }
`;

export { GET_USER, GET_USER_BY_EMAIL, GET_ALL_USERS };

import { GET_USER } from "../queries/userQueries";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import { GET_ALL_USERS } from "../queries/userQueries";
import { UPDATE_USER, LOG_IN_USER } from "../mutations/userMutations";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";

export function QueryGetUser(id) {
  console.log("QueryGetUser FUNCTION");
  // Get User on load
  if (id === undefined) console.log("UNDEFINED");

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
  });

  if (loading) {
    console.log("--LOADING--");
    // return <h1>LOADING...</h1>;
    // throw new Error("Loading");
    return { loading };
  }
  if (error) {
    throw new Error("Error getting User Data");
  }
  console.log("user data", data);
  if (!data || data.getUser == null) {
    throw new Error("Data is null");
  }
  const user = data.getUser;
  const { id: queriedId, name, balance, transactions } = user;
  console.log("USER", user);
  console.log("NAME", name);

  const currentBalance = balance;
  const xTransactions = transactions;

  return { loading, queriedId, name, currentBalance, xTransactions };
}

export function QueryGetUserByEmail(email) {
  console.log("QueryGetUserByEmail FUNCTION");
  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });

  if (data) return data;
}

export function QueryAllUsers() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  console.log("ALL DATA", data);
  if (data) console.log(data.getAllUsers);
  if (data) return data.getAllUsers;
}

export function MutationLogIn(email, password) {
  console.log("-- MutationLogIn FUNCTION--");
  const [user] = useMutation(LOG_IN_USER, {
    refetchQueries: [{ query: GET_USER_BY_EMAIL, variables: { email } }],
  });

  console.log("MutationLogIn user", user);

  return user;
}

export function MutationUpdateUser(id, email) {
  console.log("-- MutationUpdateUser FUNCTION--");
  // Update User when Deposit button is clicked
  if (id === undefined) console.log("id UNDEFINED");
  console.log("in MutationUpdateUser");
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [
      {
        // query: GET_USER,
        // variables: { id },
        query: GET_USER_BY_EMAIL,
        variables: { email },
      },
    ],
    // update(cache, { data }) {
    //   const { getUserByEmail } = cache.readQuery({
    //     query: GET_USER_BY_EMAIL,
    //   });
    //   cache.writeQuery({
    //     query: GET_USER_BY_EMAIL,
    //     data: {
    //       getUserByEmail: {
    //         ...getUserByEmail,
    //         email,
    //       },
    //     },
    //   });
    // },
  });

  return updateUser;
}

// export function QueryUserEmail(email) {
//   console.log("QueryUserEmail()");
//   const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
//     variables: { email },
//   });
//   if (error) {
//     // throw new Error("Error getting User Data");
//   }
//   if (!data || data.getUserByEmail == null) {
//     // throw new Error("Data is null");
//   }

//   if (data && data.getUserByEmail) {
//     console.log("email data", data.getUserByEmail);
//     const { id, email } = data.getUserByEmail;
//     return { id, email };
//   }
//   return null;
// }

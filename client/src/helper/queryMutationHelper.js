import { GET_USER } from "../queries/userQueries";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import { GET_ALL_USERS } from "../queries/userQueries";
import { UPDATE_USER } from "../mutations/userMutations";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";

export function QueryGetUser(id) {
  console.log("QueryGetUser FUNCTION");
  // Get User on load
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
  const { name, balance, transactions } = user;
  console.log("USER", user);
  console.log("NAME", name);

  const currentBalance = balance;
  const xTransactions = transactions;

  return { loading, name, currentBalance, xTransactions };
}

export function MutationUpdateUser(id) {
  // Update User when Deposit button is clicked
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USER, variables: { id } }],
  });

  return updateUser;
}

export function QueryAllUsers() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  console.log("ALL DATA", data);
  if (data) console.log(data.getAllUsers);
  if (data) return data.getAllUsers;
}

//TODO: ERROR HANDLING FOR WHEN DB IS DOWN (TRY IT BY STOPPING DOCKER CONTAINER)
export function QueryUserEmail(email) {
  console.log("QueryUserEmail()");
  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
  });
  if (error) {
    // throw new Error("Error getting User Data");
  }
  if (!data || data.getUserByEmail == null) {
    // throw new Error("Data is null");
  }

  if (data && data.getUserByEmail) {
    console.log("email data", data.getUserByEmail);
    const { id, email } = data.getUserByEmail;
    return { id, email };
  }
  return null;
}

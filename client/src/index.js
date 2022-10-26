import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import DatabaseDown from "./components/DatabaseDown";

export const UserContext = React.createContext(null);

// Apollo Client cache
//TODO: Auth for Token
// const cache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         users: {
//           merge(existing, incoming) {
//             return incoming;
//           },
//         },
//       },
//     },
//   },
// });

const httpLink = new HttpLink({
  uri: "http://localhost:5050/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log("on error function called");
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) {
    console.log(`[Network ERROR]: ${networkError}`);
    return <DatabaseDown />;
  }
});

const client = new ApolloClient({
  // uri: `http://localhost:5050/graphql`,
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({ addTypename: false }),
  // cache,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

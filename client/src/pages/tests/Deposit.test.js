import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { GET_USER } from "../../queries/userQueries";
import Deposit from "../Deposit";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import NavBar from "../../components/NavBar";
import { BrowserRouter } from "react-router-dom";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { SchemaLink } from "@apollo/client/link/schema";
import { addMocksToSchema } from "@graphql-tools/mock";

const typeDefs = `
  type User {
    id: ID!
    name: String!
    balance: Int!
  }

  
  type Query {
    getUser(id: ID!): User!
  }
`;
const schema = makeExecutableSchema({ typeDefs });

it("should render User", async () => {
  const mockSchema = addMocksToSchema({
    schema,
    mocks: {
      Query: {
        getUser: () => ({ id: 1563, name: "Fido", balance: 23 }),
      },
    },
  });

  const client = new ApolloClient({
    link: new SchemaLink({ schema: mockSchema }),
    cache: new InMemoryCache(),
  });

  render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <NavBar id="63567656f539277d4d9fa3bd" />
        <Deposit />
      </BrowserRouter>
    </ApolloProvider>
  );
});

describe("rendering Deposit Component", () => {
  it("should render the deposit", async () => {
    // client has the exact same configuration as our root app client
    const client = new ApolloClient({
      cache: new InMemoryCache(),
    });

    render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <NavBar id="3" />
          <Deposit />
        </BrowserRouter>
      </ApolloProvider>
    );
  });
});

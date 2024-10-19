const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];
let nextId = 3;

const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
  }

  type Query {
    getUser(id: Int!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String, email: String): User
    deleteUser(id: Int!): User
  }
`;

const resolvers = {
  Query: {
    getUser: (_, { id }) => users.find(user => user.id === id),
    getUsers: () => users,
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const newUser = { id: nextId++, name, email };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, name, email }) => {
      let user = users.find(user => user.id === id);
      if (!user) return null;

      if (name) user.name = name;
      if (email) user.email = email;

      return user;
    },
    deleteUser: (_, { id }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return null;
      const removedUser = users[userIndex];
      users.splice(userIndex, 1);
      return removedUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  const app = express();
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log('Server running at http://localhost:4000' + server.graphqlPath)
  );
}

startServer();

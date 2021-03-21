const { ApolloServer } = require("apollo-server-lambda")
const { schema } = require("../dist/schema")
const { resolvers } = require("../dist/resolvers")
const { getContext } = require("../dist/context")

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: getContext,
})

exports.handler = server.createHandler()

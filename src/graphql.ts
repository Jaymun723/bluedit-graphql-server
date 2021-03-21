import { ApolloServer } from "apollo-server-lambda"
import { schema } from "./schema"
import { resolvers } from "./resolvers"
import { getContext } from "./context"

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: getContext,
})

const handler = server.createHandler()

export { handler }

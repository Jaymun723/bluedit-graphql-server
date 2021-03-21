import { ApolloServer } from "@jaymun723/apollo-server-vercel"
import { schema } from "./schema"
import { resolvers } from "./resolvers"
import { getContext } from "./context"

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: getContext,
  playground: true,
  introspection: true,
})

const handler = server.createHandler({ cors: { origin: "*" } })

export default handler

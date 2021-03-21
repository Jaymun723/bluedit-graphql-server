import { ApolloServer } from "apollo-server"
import { resolvers } from "./resolvers"
import { getContext } from "./context"
import { schema } from "./schema"

export const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers as any,
  context: getContext,
})

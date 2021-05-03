import { ApolloServer } from "./server"
import { schema } from "./schema"
import { resolvers } from "./resolvers"
import { getContext } from "./context"
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: getContext(prisma),
  playground: true,
  introspection: true,
  uploads: false,
})

const handler = server.createHandler({ cors: { origin: "*" } })

export default handler

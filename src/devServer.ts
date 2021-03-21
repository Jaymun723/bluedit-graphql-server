// This file is not used in production

import { config } from "dotenv"
import * as path from "path"

config({ path: path.resolve(__dirname, "../prisma/.env") })

import { ApolloServer } from "apollo-server"
import { resolvers } from "./resolvers"
import { getContext } from "./context"
import { schema } from "./schema"

export const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers as any,
  context: getContext,
})

const main = async () => {
  server.listen(4000, () => {
    console.log(`Server running on http://localhost:4000`)
  })
}

main()

# Bluedit Graphql Server

Online version: https://bluedit-graphql-server.vercel.app/

The stack:

- Language: [Typescript](https://www.typescriptlang.org/)
- Database: [Prisma](https://prisma.io) with [PostgreSQL](https://www..org/)
- Graphql schema and resolvers typings: [gql-codegen](https://www.graphql-code-generator.com/)
- Server: [Apollo Server](https://www.apollographql.com/docs/apollo-server/) hosted on [Vercel](https://vercel.com/)
- Bundling: [Rollup](https://www.rollupjs.org/)
- Auth: [jsonwebtoken](https://jwt.io/) and [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- Web scrappig (for website preview): [Cheerio](https://cheerio.js.org/)

## Installation

```sh
npm install # install npm dependencies
npm run prisma-generate # generates prisma client bindings
npm run gql-gen # read the schema (in src/schema.ts) and create typings for the resolvers
```

## Deploying (on vercel)

```
vercel # yes, that's all
```

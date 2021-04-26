import { QueryResolvers } from "../../generated/graphql"

export const bluedits: QueryResolvers["bluedits"] = (parent, args, ctx, info) => {
  return ctx.prisma.bluedit.findMany({
    skip: args.pagination?.skip,
    take: args.pagination?.take,
  })
}

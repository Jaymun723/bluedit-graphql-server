import { QueryResolvers } from "../../generated/graphql"

export const bluedits: QueryResolvers["bluedits"] = (parent, args, ctx, info) => {
  return ctx.prisma.bluedit.findMany()
}

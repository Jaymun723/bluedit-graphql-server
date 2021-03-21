import { QueryResolvers } from "../../generated/graphql"

export const users: QueryResolvers["users"] = (parent, args, ctx, info) => {
  return ctx.prisma.user.findMany()
}

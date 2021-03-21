import { QueryResolvers } from "../../generated/graphql"
import { getUserId } from "../../utils"

export const me: QueryResolvers["me"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)
  return (await ctx.prisma.user.findUnique({ where: { id: userId } }))!
}

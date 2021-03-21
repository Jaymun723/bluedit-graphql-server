import { MutationResolvers } from "../../generated/graphql"
import { getUserId } from "../../utils"

export const subscribe: MutationResolvers["subscribe"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const bluedit = await ctx.prisma.bluedit.findUnique({ where: { id: args.id } })
  if (!bluedit) {
    throw new Error("Unable to find this bluedit.")
  }

  return ctx.prisma.bluedit.update({
    where: { id: args.id },
    data: { subscribers: { connect: { id: userId } } },
  })
}

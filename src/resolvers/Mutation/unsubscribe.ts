import { MutationResolvers } from "../../generated/graphql"
import { getUserId } from "../../utils"

export const unsubscribe: MutationResolvers["unsubscribe"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const subbedBluedit = await ctx.prisma.bluedit.findMany({
    where: {
      AND: [
        {
          subscribers: {
            some: {
              id: userId,
            },
          },
        },
        {
          id: args.id,
        },
      ],
    },
  })

  if (subbedBluedit.length !== 1) {
    throw new Error("Unable to find this bluedit.")
  }

  return ctx.prisma.bluedit.update({
    where: {
      id: args.id,
    },
    data: {
      subscribers: {
        disconnect: {
          id: userId,
        },
      },
    },
  })
}

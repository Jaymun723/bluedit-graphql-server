import { MutationResolvers } from "../../generated/graphql"
import { getUserId } from "../../utils"

export const removeComment: MutationResolvers["removeComment"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const commentExist = await ctx.prisma.comment.findMany({
    where: {
      authorId: userId,
      id: args.id,
      deleted: false,
    },
  })
  if (commentExist.length !== 1) {
    throw new Error("Unable to find this comment.")
  }

  return ctx.prisma.comment.update({
    where: {
      id: args.id,
    },
    data: {
      deleted: { set: true },
      content: { set: "removed" },
      votes: {
        deleteMany: {},
      },
      lastEditedAt: { set: new Date() },
    },
  })
}

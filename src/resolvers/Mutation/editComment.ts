import { MutationResolvers } from "../../generated/graphql"
import { getUserId } from "../../utils"
import { contentValidator } from "../../validators"

export const editComment: MutationResolvers["editComment"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const content = contentValidator(args.content)

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
    data: {
      content: { set: content },
      lastEditedAt: { set: new Date() },
    },
    where: {
      id: args.id,
    },
  })
}

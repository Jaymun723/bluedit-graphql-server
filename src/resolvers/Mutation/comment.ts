import { MutationResolvers } from "../../generated/graphql"
import { getUserId } from "../../utils"
import { contentValidator } from "../../validators"

export const comment: MutationResolvers["comment"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const content = contentValidator(args.content)

  const postExist = await ctx.prisma.post.findUnique({ where: { id: args.postId } })
  if (!postExist) {
    throw new Error("Unable to find this post.")
  }

  let onComment = false
  if (args.commentId) {
    const commentExist = await ctx.prisma.comment.findMany({ where: { id: args.commentId, deleted: false } })
    if (commentExist.length !== 1) {
      throw new Error("Unable to find this comment.")
    }
    onComment = true
  }

  return ctx.prisma.comment.create({
    data: {
      author: {
        connect: {
          id: userId,
        },
      },
      content,
      post: {
        connect: {
          id: args.postId,
        },
      },
      comment: onComment
        ? {
            connect: {
              id: args.commentId!,
            },
          }
        : undefined,
    },
  })
}

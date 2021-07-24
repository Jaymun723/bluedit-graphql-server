import { Comment } from "@prisma/client"
import { sendCOnC, sendCOnP } from "../../email"
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

  let commentExist: Comment | undefined
  if (args.commentId) {
    const commentExist = await ctx.prisma.comment.findMany({
      where: { id: args.commentId, deleted: false },
    })
    if (commentExist.length !== 1) {
      throw new Error("Unable to find this comment.")
    }
  }

  const newComment = await ctx.prisma.comment.create({
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
      comment: commentExist
        ? {
            connect: {
              id: args.commentId!,
            },
          }
        : undefined,
    },
  })

  if (commentExist && commentExist.authorId !== userId) {
    await sendCOnC({
      newComment,
      post: postExist,
      previousComment: commentExist,
    })
  } else if (postExist.authorId !== userId) {
    await sendCOnP({
      comment: newComment,
      post: postExist,
    })
  }

  return newComment
}

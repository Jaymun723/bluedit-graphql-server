import { MutationResolvers } from "../../generated/graphql"
import { getUserId } from "../../utils"

export const removePost: MutationResolvers["removePost"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const postExist = await ctx.prisma.post.findMany({
    where: {
      authorId: userId,
      id: args.id,
    },
  })
  if (postExist.length !== 1) {
    throw new Error("Unable to find this post.")
  }

  await ctx.prisma.vote.deleteMany({
    where: {
      postId: args.id,
    },
  })

  await ctx.prisma.comment.deleteMany({
    where: {
      postId: args.id,
    },
  })

  return ctx.prisma.post.delete({
    where: { id: args.id },
  })
}

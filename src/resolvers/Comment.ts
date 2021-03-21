import { CommentResolvers } from "../generated/graphql"
import { getUserId } from "../utils"

export const commentResolver: CommentResolvers = {
  author: async (parent, args, ctx, info) => {
    return (await ctx.prisma.user.findUnique({ where: { id: parent.authorId } }))!
  },
  post: async (parent, args, ctx, info) => {
    return (await ctx.prisma.post.findUnique({ where: { id: parent.postId } }))!
  },
  votes: (parent, args, ctx, info) => {
    return ctx.prisma.comment.findUnique({ where: { id: parent.id } }).votes()
  },
  userVote: async (parent, args, ctx, info) => {
    const userId = await getUserId(ctx).catch(() => undefined)

    if (!userId) {
      return null
    }

    const votes = await ctx.prisma.vote.findMany({
      where: {
        postId: parent.postId,
        authorId: userId,
        commentId: parent.id,
      },
    })

    if (votes.length === 1) {
      return votes[0]
    }
    return null
  },
  // voteCount: async (parent, args, ctx, info) => {
  //   const votes = await ctx.prisma.vote.findMany({
  //     where: {
  //       commentId: parent.id,
  //     },
  //   })

  //   return voteCount(votes)
  // },
  comment: async (parent, args, ctx, info) => {
    return ctx.prisma.comment.findUnique({ where: { id: parent.id } }).comment()
  },
  childComments: async (parent, args, ctx, info) => {
    return ctx.prisma.comment.findUnique({ where: { id: parent.id } }).childComments()
  },
}

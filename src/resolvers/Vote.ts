import { VoteResolvers } from "../generated/graphql"

export const voteResolver: VoteResolvers = {
  post: async (parent, args, ctx, info) => {
    return (await ctx.prisma.post.findUnique({ where: { id: parent.postId } }))!
  },
  author: async (parent, args, ctx, info) => {
    return (await ctx.prisma.user.findUnique({ where: { id: parent.authorId } }))!
  },
  comment: (parent, args, ctx, info) => {
    if (parent.commentId) {
      return ctx.prisma.comment.findUnique({ where: { id: parent.commentId } })
    }
    return null
  },
}

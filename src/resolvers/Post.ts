import { PostResolvers } from "../generated/graphql"
import { voteCount, getUserId } from "../utils"

export const postResolver: PostResolvers = {
  bluedit: async (parent, args, ctx, info) => {
    return (await ctx.prisma.bluedit.findUnique({ where: { id: parent.blueditId } }))!
  },
  author: async (parent, args, ctx, info) => {
    return (await ctx.prisma.user.findUnique({ where: { id: parent.authorId } }))!
  },
  comments: (parent, args, ctx, info) => {
    return ctx.prisma.post.findUnique({ where: { id: parent.id } }).comments()
  },
  votes: (parent, args, ctx, info) => {
    return ctx.prisma.vote.findMany({
      where: {
        AND: [{ postId: parent.id }, { NOT: { comment: {} } }],
      },
    })
  },
  userVote: async (parent, args, ctx, info) => {
    const userId = await getUserId(ctx)

    const votes = await ctx.prisma.vote.findMany({
      where: {
        postId: parent.id,
        authorId: userId,
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
  //       AND: [{ postId: parent.id }, { NOT: { comment: {} } }],
  //     },
  //   })

  //   return voteCount(votes)
  // },
  commentCount: async (parent, args, ctx, info) => {
    return ctx.prisma.comment.count({ where: { postId: parent.id, deleted: false } })
  },
}

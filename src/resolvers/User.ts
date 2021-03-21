import { UserResolvers } from "../generated/graphql"
import { getUserId, voteCount } from "../utils"

export const userResolver: UserResolvers = {
  // createAt: async (parent, args, ctx, info) => {
  //   return parent.createdAt.toISOString()
  // },
  email: async (parent, args, ctx, info) => {
    const userId = await getUserId(ctx)
    if (userId === parent.id) {
      return parent.email
    }
    throw new Error("You can't view other users email.")
  },
  bluedits: (parent, args, ctx, info) => {
    return ctx.prisma.user.findUnique({ where: { id: parent.id } }).bluedits()
  },
  comments: (parent, args, ctx, info) => {
    return ctx.prisma.user.findUnique({ where: { id: parent.id } }).comments()
  },
  votes: (parent, args, ctx, info) => {
    return ctx.prisma.user.findUnique({ where: { id: parent.id } }).votes()
  },
  posts: (parent, args, ctx, info) => {
    return ctx.prisma.user.findUnique({ where: { id: parent.id } }).posts()
  },
  postCount: (parent, args, ctx, info) => {
    return ctx.prisma.post.count({ where: { authorId: parent.id } })
  },
  karma: async (parent, args, ctx, info) => {
    const votes = await ctx.prisma.vote.findMany({
      where: {
        OR: [
          {
            post: {
              authorId: parent.id,
              // is: {
              //   authorId: parent.id,
              // },
            },
          },
          {
            comment: {
              authorId: parent.id,
              // is: {
              //   authorId: parent.id,
              // },
            },
          },
        ],
      },
    })

    return voteCount(votes)
  },
}

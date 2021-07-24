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
  emailOnComment: async (parent, args, ctx, info) => {
    const userId = await getUserId(ctx)
    if (userId === parent.id) {
      return parent.emailOnComment
    }
    throw new Error("You can't view other users settings.")
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
    // return ctx.prisma.user.findUnique({ where: { id: parent.id } }).posts({
    //   // orderBy: { createdAt: "desc" },
    //   skip: args.pagination?.skip,
    //   take: args.pagination?.take,
    // })
    return ctx.prisma.post.findMany({
      where: { authorId: parent.id },
      take: args.pagination?.take,
      skip: args.pagination?.skip,
      orderBy: { createdAt: "desc" },
    })
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

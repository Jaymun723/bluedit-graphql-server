import { BlueditResolvers } from "../generated/graphql"
import { getUserId } from "../utils"

export const blueditResolver: BlueditResolvers = {
  posts: (parent, args, ctx, info) => {
    return ctx.prisma.bluedit.findUnique({ where: { id: parent.id } }).posts()
  },
  subscribers: (parent, args, ctx, info) => {
    return ctx.prisma.bluedit.findUnique({ where: { id: parent.id } }).subscribers()
  },
  subscriberCount: (parent, args, ctx, info) => {
    return ctx.prisma.user.count({ where: { bluedits: { some: { id: parent.id } } } })
  },
  postCount: (parent, args, ctx, info) => {
    return ctx.prisma.post.count({ where: { bluedit: { id: parent.id } } })
  },
  userSubscribed: async (parent, args, ctx, info) => {
    try {
      const userId = await getUserId(ctx)

      const blueditExists = await ctx.prisma.bluedit.findMany({
        where: {
          id: parent.id,
          subscribers: { some: { id: userId } },
        },
      })

      return blueditExists.length === 1
    } catch {
      return false
    }
  },
}

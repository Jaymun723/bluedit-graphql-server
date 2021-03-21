import { QueryResolvers, SortType } from "../../generated/graphql"
import { getUserId } from "../../utils"

export const personalFeed: QueryResolvers["personalFeed"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const sortKey =
    args.sort === SortType.New ? "createdAt" : args.sort === SortType.Trending ? "trendingScore" : "voteCount"

  return ctx.prisma.post.findMany({
    orderBy: { [sortKey]: "desc" },
    where: {
      bluedit: {
        // is: {
        //   subscribers: {
        //     some: { id: userId },
        //   },
        // },
        subscribers: {
          some: { id: userId },
        },
      },
    },
    skip: args.pagination?.skip,
    take: args.pagination?.take,
  })
}

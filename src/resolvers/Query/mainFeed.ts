import { QueryResolvers, SortType } from "../../generated/graphql"

export const mainFeed: QueryResolvers["mainFeed"] = async (parent, args, ctx, info) => {
  const sortKey =
    args.sort === SortType.New ? "createdAt" : args.sort === SortType.Trending ? "trendingScore" : "voteCount"

  return ctx.prisma.post.findMany({
    orderBy: { [sortKey]: "desc" },
    skip: args.pagination?.skip,
    take: args.pagination?.take,
  })
}

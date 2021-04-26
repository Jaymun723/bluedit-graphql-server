import { QueryResolvers, SortType } from "../../generated/graphql"

export const mainFeed: QueryResolvers["mainFeed"] = async (parent, args, ctx, info) => {
  let orderBy
  if (args.sort === SortType.New) {
    orderBy = {
      createdAt: "desc" as const,
    }
  } else if (args.sort === SortType.Best) {
    orderBy = {
      voteCount: "desc" as const,
    }
  } else {
    orderBy = {
      trendingScore: "desc" as const,
    }
  }

  return ctx.prisma.post.findMany({
    orderBy,
    skip: args.pagination?.skip,
    take: args.pagination?.take,
  })
}

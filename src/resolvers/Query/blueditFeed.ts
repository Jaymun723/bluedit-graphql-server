import { QueryResolvers, SortType } from "../../generated/graphql"

export const blueditFeed: QueryResolvers["blueditFeed"] = async (parent, args, ctx, info) => {
  if (!args.id && !args.name) {
    throw new Error("No bluedit name or id specified.")
  }

  const blueditExist = await ctx.prisma.bluedit.findUnique({
    where: args.id ? { id: args.id } : { name: args.name! },
  })
  if (!blueditExist) {
    throw new Error("Unable to find this bluedit.")
  }

  // const sortKey =
  //   args.sort === SortType.New ? "createdAt" : args.sort === SortType.Trending ? "trendingScore" : "voteCount"

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
      trendingScore: "asc" as const,
    }
  }

  return ctx.prisma.post.findMany({
    orderBy,
    where: { blueditId: blueditExist.id },
    skip: args.pagination?.skip,
    take: args.pagination?.take,
  })
}

import { QueryResolvers } from "../../generated/graphql"
import { Bluedit, Post, User } from "@prisma/client"

export const search: QueryResolvers["search"] = async (parent, { query }, ctx, info) => {
  if (query.length === 0) {
    return []
  }

  const blueditResults = await ctx.prisma.bluedit.findMany({
    where: {
      name: {
        contains: query,
      },
    },
  })
  const postTitleResults = await ctx.prisma.post.findMany({
    where: {
      title: { contains: query },
    },
  })
  const userResults = await ctx.prisma.user.findMany({
    where: {
      name: {
        contains: query,
      },
    },
  })
  const postContentResults = await ctx.prisma.post.findMany({
    where: {
      content: {
        contains: query,
      },
      id: { notIn: postTitleResults.map(({ id }) => id) },
    },
  })

  let res: (Bluedit | Post | User)[] = blueditResults
  res = res.concat(postTitleResults)
  res = res.concat(userResults)
  res = res.concat(postContentResults)

  return res
}

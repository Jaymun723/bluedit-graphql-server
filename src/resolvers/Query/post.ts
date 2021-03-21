import { QueryResolvers } from "../../generated/graphql"

export const post: QueryResolvers["post"] = async (parent, args, ctx, info) => {
  const post = await ctx.prisma.post.findUnique({ where: { id: args.id } })

  if (!post) {
    throw new Error("Unable to find this post.")
  }

  return post
}

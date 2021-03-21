import { QueryResolvers } from "../../generated/graphql"

export const comment: QueryResolvers["comment"] = async (parent, args, ctx, info) => {
  const comment = await ctx.prisma.comment.findUnique({ where: { id: args.id } })

  if (!comment) {
    throw new Error("Unable to find this comment.")
  }

  return comment
}

import { QueryResolvers } from "../../generated/graphql"

export const bluedit: QueryResolvers["bluedit"] = async (parent, args, ctx, info) => {
  if (!args.name && !args.id) {
    throw new Error("No bluedit name or id specified.")
  }

  const bluedit = await ctx.prisma.bluedit.findUnique({ where: args.id ? { id: args.id } : { name: args.name! } })

  if (!bluedit) {
    throw new Error("Unable to find this Bluedit.")
  }

  return bluedit
}

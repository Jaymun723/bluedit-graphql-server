import { QueryResolvers } from "../../generated/graphql"

export const user: QueryResolvers["user"] = async (parent, args, ctx, info) => {
  if (!args.id && !args.name) {
    throw new Error("No user name or id specified.")
  }

  const user = await ctx.prisma.user.findUnique({ where: args.id ? { id: args.id } : { name: args.name! } })

  if (!user) {
    throw new Error("Unable to find this User.")
  }

  return user
}

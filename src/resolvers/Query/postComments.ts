import { QueryResolvers } from "../../generated/graphql"

export const postComments: QueryResolvers["postComments"] = (parent, args, ctx, info) => {
  return ctx.prisma.post.findUnique({ where: { id: args.postid } }).comments()
}

import { MutationResolvers } from "../../generated/graphql"
import { getUserId } from "../../utils"
import { contentValidator } from "../../validators"

export const editTextPost: MutationResolvers["editTextPost"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const post = await ctx.prisma.post.findUnique({
    where: {
      id: args.id,
    },
  })
  if (!post) {
    throw new Error("Post not found.")
  }

  if (post.authorId !== userId) {
    throw new Error("Your not the author of this post.")
  }

  const content = contentValidator(args.content)

  return ctx.prisma.post.update({
    where: {
      id: args.id,
    },
    data: {
      content,
    },
  })
}

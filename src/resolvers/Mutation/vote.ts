import { Vote } from ".prisma/client"
import { MutationResolvers } from "../../generated/graphql"
import { computeVoteCount, getUserId, trendingFormula } from "../../utils"
import { user } from "../Query/user"

export const vote: MutationResolvers["vote"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const post = await ctx.prisma.post.findUnique({ where: { id: args.postId } })
  if (!post) {
    throw new Error("Unable to find this post.")
  }

  if (args.commentId) {
    const comment = await ctx.prisma.comment.findFirst({
      where: {
        id: args.postId,
        postId: args.postId,
      },
    })

    if (!comment) {
      throw new Error("Unable to find this comment.")
    }

    const currentVote = await ctx.prisma.vote.findFirst({
      where: { commentId: comment.id, authorId: userId },
    })

    let newVote: Vote
    if (!currentVote) {
      newVote = await ctx.prisma.vote.create({
        data: {
          up: args.up,
          commentId: comment.id,
          authorId: userId,
          postId: post.id,
        },
      })
    } else if (args.up !== currentVote.up) {
      newVote = await ctx.prisma.vote.update({
        where: {
          id: currentVote.id,
        },
        data: {
          up: args.up,
        },
      })
    } else {
      newVote = await ctx.prisma.vote.delete({
        where: {
          id: currentVote.id,
        },
      })
    }

    await computeVoteCount({
      id: comment.id,
      type: "comment",
    })

    return newVote
  }

  const currentVote = await ctx.prisma.vote.findFirst({
    where: {
      postId: post.id,
      authorId: userId,
    },
  })

  let newVote: Vote
  if (!currentVote) {
    newVote = await ctx.prisma.vote.create({
      data: {
        up: args.up,
        authorId: userId,
        postId: post.id,
      },
    })
  } else if (args.up !== currentVote.up) {
    newVote = await ctx.prisma.vote.update({
      data: {
        up: args.up,
      },
      where: {
        id: currentVote.id,
      },
    })
  } else {
    newVote = await ctx.prisma.vote.delete({
      where: {
        id: currentVote.id,
      },
    })
  }

  await computeVoteCount({
    id: post.id,
    type: "post",
  })

  return newVote
}

import { MutationResolvers } from "../../generated/graphql"
import { getUserId, trendingFormula } from "../../utils"

export const vote: MutationResolvers["vote"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)

  const postExist = await ctx.prisma.post.findUnique({ where: { id: args.postId } })
  if (!postExist) {
    throw new Error("Unable to find this post.")
  }

  // To reuse later
  let comment
  if (args.commentId) {
    const commentExist = await ctx.prisma.comment.findMany({
      where: { id: args.commentId, deleted: false },
    })
    if (commentExist.length !== 1) {
      throw new Error("Unable to find this comment.")
    }
    comment = commentExist[0]
  }

  const voteExist = await ctx.prisma.vote.findMany({
    where: {
      authorId: userId,
      commentId: args.commentId,
      postId: args.postId,
    },
  })

  if (voteExist.length === 1) {
    // The vote already exist
    const [vote] = voteExist
    if (vote.up !== args.up) {
      // Change in "direction" perform real update

      if (comment) {
        let voteCount = comment.voteCount
        // Because we remove previous vote value
        voteCount += args.up ? 2 : -2

        await ctx.prisma.comment.update({
          where: { id: comment.id },
          data: { voteCount: { set: voteCount } },
        })
      } else {
        let voteCount = postExist.voteCount
        voteCount += args.up ? 2 : -2

        await ctx.prisma.post.update({
          where: { id: args.postId },
          data: {
            voteCount: { set: voteCount },
            trendingScore: { set: trendingFormula(voteCount, new Date(postExist.createdAt)) },
          },
        })
      }

      return ctx.prisma.vote.update({
        where: { id: vote.id },
        data: { up: { set: args.up } },
      })
    } else {
      if (comment) {
        let voteCount = comment.voteCount
        voteCount += args.up ? -1 : 1

        await ctx.prisma.comment.update({
          where: { id: comment.id },
          data: { voteCount: { set: voteCount }, votes: { delete: { id: vote.id } } },
        })
      } else {
        let voteCount = postExist.voteCount
        voteCount += args.up ? -1 : 1

        await ctx.prisma.post.update({
          where: { id: args.postId },
          data: {
            voteCount: { set: voteCount },
            votes: { delete: { id: vote.id } },
            trendingScore: { set: trendingFormula(voteCount, new Date(postExist.createdAt)) },
          },
        })
      }

      return vote
    }
  } else {
    // New vote !

    // Update comment voteCount
    if (comment) {
      await ctx.prisma.comment.update({
        where: {
          id: comment.id,
        },
        data: {
          voteCount: { set: comment.voteCount + (args.up ? 1 : -1) },
        },
      })
    } else {
      // Update post voteCount
      let voteCount = postExist.voteCount + (args.up ? 1 : -1)

      await ctx.prisma.post.update({
        where: {
          id: args.postId,
        },
        data: {
          voteCount: { set: voteCount },
          trendingScore: { set: trendingFormula(voteCount, new Date(postExist.createdAt)) },
        },
      })
    }

    return ctx.prisma.vote.create({
      data: {
        author: {
          connect: { id: userId },
        },
        post: { connect: { id: args.postId } },
        up: args.up,
        comment: args.commentId ? { connect: { id: args.commentId } } : undefined,
      },
    })
  }
}

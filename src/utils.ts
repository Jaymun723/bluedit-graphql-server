import { verify } from "jsonwebtoken"
import { Context, prisma } from "./context"
import fetch from "node-fetch"
import FormData from "form-data"
import { ReadStream } from "fs"

export const APP_SECRET = process.env["APP_SECRET"]!

export interface JWTToken {
  userId: string
}

export async function getUserId(ctx: Context) {
  const Authorization = ctx.req.get("Authorization")
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "")
    const verifiedToken = verify(token, APP_SECRET) as JWTToken
    if (verifiedToken && verifiedToken.userId) {
      // const user = await ctx.prisma.user.findUnique({ where: { id: verifiedToken.userId } })
      const user = await ctx.prisma.user.findUnique({ where: { id: verifiedToken.userId } })
      if (user) {
        return user.id
      }
    }
  }
  throw new Error("Unauthorized.")
}

export const voteCount = (votes: { up: boolean }[]) => {
  return votes.reduce((count, vote) => (vote.up ? count + 1 : count - 1), 0)
}

// Hacker news formula
export const trendingFormula = (votes: number, time: Date) => {
  const hourAge = (Date.now() - time.getTime()) / (1000 * 3600)
  return (votes - 1) / Math.pow(hourAge + 2, 1.8)
}

export const updateTrendingScore = async () => {
  const posts = await prisma.post.findMany({ select: { voteCount: true, id: true, createdAt: true } })

  const res = Promise.all(
    posts.map((post) => {
      return prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          trendingScore: { set: trendingFormula(post.voteCount, post.createdAt) },
        },
        select: null,
      })
    })
  )

  await res
}

export const storeImage = async (image: ReadStream) => {
  const apiUrl = new URL("https://api.imgbb.com/1/upload")
  apiUrl.searchParams.append("key", process.env.IMGDB_API_KEY!)

  const body = new FormData()
  body.append("image", image)

  const res = await fetch(apiUrl, {
    method: "POST",
    body,
  })
  const json = (await res.json()) as {
    data: {
      url: string
    }
  }

  return json.data.url
}

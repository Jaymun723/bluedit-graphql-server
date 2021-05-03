import { verify } from "jsonwebtoken"
import { Context } from "./context"
import fetch from "node-fetch"
import FormData from "form-data"
import { prisma } from "./graphql"
import fs from "fs"

export const APP_SECRET = process.env["APP_SECRET"]!

export interface JWTToken {
  userId: string
}

export async function getUserId(ctx: Context) {
  if ("authorization" in ctx.req.headers && typeof ctx.req.headers.authorization === "string") {
    const Authorization = ctx.req.headers["authorization"] as string
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
  return (votes + 1) / Math.pow(hourAge + 2, 1.8)
}

export const updateTrendingScore = async () => {
  const posts = await prisma.post.findMany({
    select: { voteCount: true, id: true, createdAt: true },
  })

  const res = Promise.all(
    posts.map((post) => {
      let score = trendingFormula(post.voteCount, post.createdAt)
      return prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          trendingScore: { set: score },
        },
        select: null,
      })
    })
  )

  await res
}

interface ImageDescriptor {
  filename: string
  name: string
  extension: string
  url: string
}

interface ImgDBResponse {
  data: {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    size: number
    time: string
    expiration: string
    image: ImageDescriptor
    thumb: ImageDescriptor
    medium: ImageDescriptor
    delete_url: string
  }
  success: boolean
  status: number
}

export const storeImage = async (filePath: string) => {
  const image = fs.createReadStream(filePath)

  const apiUrl = new URL("https://api.imgbb.com/1/upload")
  apiUrl.searchParams.append("key", process.env.IMGDB_API_KEY!)

  const body = new FormData()
  body.append("image", image)

  const res = await fetch(apiUrl, {
    method: "POST",
    body,
  })

  if (!res.ok) {
    console.error(await res.text())
    throw new Error("Problem when uploading image to ImgDB.")
  }

  const json = (await res.json()) as ImgDBResponse

  return json
}

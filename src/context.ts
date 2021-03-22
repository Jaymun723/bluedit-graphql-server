import { PrismaClient } from "@prisma/client"
import { VercelRequest, VercelResponse } from "@vercel/node"

export interface Context {
  prisma: PrismaClient
  req: VercelRequest
  res: VercelResponse
}

export const prisma = new PrismaClient()

export const getContext = (ctx: any): Context => {
  return {
    prisma,
    ...ctx,
  }
}

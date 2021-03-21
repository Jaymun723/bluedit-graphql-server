import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
}

export const prisma = new PrismaClient()

export const getContext = (ctx: any): Context => {
  return {
    prisma,
    ...ctx,
  }
}

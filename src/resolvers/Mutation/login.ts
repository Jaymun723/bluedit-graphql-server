import { MutationResolvers } from "../../generated/graphql"
import { compareSync } from "bcryptjs"
import { APP_SECRET, JWTToken } from "../../utils"
import { sign } from "jsonwebtoken"

export const login: MutationResolvers["login"] = async (parent, args, ctx, info) => {
  const maybeUser = await ctx.prisma.user.findUnique({ where: { email: args.email } })

  if (!maybeUser) {
    throw new Error("Wrong password or email.")
  }

  const passwordCorrect = compareSync(args.password, maybeUser.password)

  if (!passwordCorrect) {
    throw new Error("Wrong password or email.")
  }

  const tokenObject: JWTToken = {
    userId: maybeUser.id,
  }

  const token = sign(tokenObject, APP_SECRET)

  return {
    token,
    user: maybeUser,
  }
}

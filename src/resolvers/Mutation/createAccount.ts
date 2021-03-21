import { MutationResolvers } from "../../generated/graphql"
import { nameValidator, emailValidator, passwordValidator } from "../../validators"
import { JWTToken, APP_SECRET } from "../../utils"
import { sign } from "jsonwebtoken"
import { hashSync } from "bcryptjs"

export const createAccount: MutationResolvers["createAccount"] = async (parent, args, ctx, info) => {
  const name = nameValidator(args.name)
  const email = emailValidator(args.email)
  const password = passwordValidator(args.password)

  const nameOrEmailExist = await ctx.prisma.user.findMany({
    where: {
      OR: [
        {
          name,
        },
        {
          email,
        },
      ],
    },
  })

  if (nameOrEmailExist.length !== 0) {
    throw new Error("Name or Email already used.")
  }

  const hashedPassword = hashSync(password, 10)

  const newUser = await ctx.prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })

  // return true
  const tokenObject: JWTToken = {
    userId: newUser.id,
  }

  const token = sign(tokenObject, APP_SECRET)

  return {
    token,
    user: newUser,
  }
}

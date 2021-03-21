import { MutationResolvers } from "../../generated/graphql"
import { nameValidator, emailValidator, bioValidator, passwordValidator } from "../../validators"
import { hashSync } from "bcryptjs"
import { getUserId } from "../../utils"

export const changeAccountSettings: MutationResolvers["changeAccountSettings"] = async (parent, args, ctx, info) => {
  const userId = await getUserId(ctx)
  const user = (await ctx.prisma.user.findUnique({ where: { id: userId } }))!

  let name = user.name
  let email = user.email
  let bio = user.bio
  let password: string | undefined

  if (args.name) {
    name = nameValidator(args.name)
    const userWithName = await ctx.prisma.user.findUnique({ where: { name } })
    if (userWithName) {
      throw new Error("Name already used.")
    }
  }

  if (args.email) {
    email = emailValidator(args.email)
    const userWithEmail = await ctx.prisma.user.findUnique({ where: { email } })
    if (userWithEmail) {
      throw new Error("Email already used.")
    }
  }

  if (args.bio) {
    bio = bioValidator(args.bio)
  }

  if (args.password) {
    password = passwordValidator(args.password)
    password = hashSync(args.password, 10)
  }

  return ctx.prisma.user.update({
    data: {
      name: { set: name },
      email: { set: email },
      bio: { set: bio },
      password: { set: password },
      // name,
      // email,
      // bio,
      // password,
    },
    where: {
      id: userId,
    },
  })
}

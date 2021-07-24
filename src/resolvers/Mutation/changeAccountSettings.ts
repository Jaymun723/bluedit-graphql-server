import { MutationResolvers } from "../../generated/graphql"
import { nameValidator, emailValidator, bioValidator, passwordValidator } from "../../validators"
import { hashSync } from "bcryptjs"
import { getUserId } from "../../utils"

export const changeAccountSettings: MutationResolvers["changeAccountSettings"] = async (
  parent,
  args,
  ctx,
  info
) => {
  const userId = await getUserId(ctx)
  const user = (await ctx.prisma.user.findUnique({ where: { id: userId } }))!

  let data: any = {}

  if (args.name && args.name !== user.name) {
    const name = nameValidator(args.name)
    const userWithName = await ctx.prisma.user.findUnique({ where: { name } })
    if (userWithName) {
      throw new Error("Name already used.")
    }
    data.name = {
      set: name,
    }
  }

  if (args.email && args.email !== user.email) {
    const email = emailValidator(args.email)
    const userWithEmail = await ctx.prisma.user.findUnique({ where: { email } })
    if (userWithEmail) {
      throw new Error("Email already used.")
    }
    data.email = {
      set: email,
    }
  }

  if (args.bio && args.bio !== user.bio) {
    const bio = bioValidator(args.bio)
    data.bio = {
      set: bio,
    }
  }

  if (args.password) {
    let password = passwordValidator(args.password)
    password = hashSync(args.password, 10)
    data.password = {
      set: password,
    }
  }

  if (typeof args.emailOnComment !== "undefined" && args.emailOnComment !== user.emailOnComment) {
    const emailOnComment = args.emailOnComment
    data.emailOnComment = {
      set: emailOnComment,
    }
  }

  return ctx.prisma.user.update({
    data,
    where: {
      id: userId,
    },
  })
}

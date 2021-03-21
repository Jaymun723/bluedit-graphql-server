import { MutationResolvers } from "../../generated/graphql"
// import { createTestAccount, createTransport } from "nodemailer"

// export const forgotPassword: MutationResolvers["forgotPassword"] = async (parent, args, ctx, info) => {
//   let host = process.env.SMTP_SERVER
//   let port = Number(process.env.SMTP_PORT)
//   let user = process.env.SMTP_LOGIN
//   let pass = process.env.SMTP_PASSWORD

//   if (process.env.NODE_ENV !== "production") {
//     const testAccount = await createTestAccount()
//     host = "smtp.ethereal.email"
//     port = 587
//     user = testAccount.user
//     pass = testAccount.pass
//   }

//   const transport = createTransport({
//     host,
//     port,
//     auth: {
//       user,
//       pass,
//     },
//   })
// }

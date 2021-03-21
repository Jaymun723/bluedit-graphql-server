const { PrismaClient, PrismaClientRequestError } = require("@prisma/client")
const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body)
    if ("email" in data && "name" in data && "password" in data) {
      const createdUser = await prisma.user.create({ data })

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdUser),
      }
    } else {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: { error: "Invalid data provided." },
      }
    }
  } catch (e) {
    if (e instanceof PrismaClientRequestError) {
      if (e.code === "P2002") {
        return {
          statusCode: 409,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: "A user with this email already exists",
          }),
        }
      }
    }

    console.error(e)
    return { statusCode: 500 }
  }
}

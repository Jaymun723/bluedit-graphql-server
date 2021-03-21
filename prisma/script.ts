import { PrismaClient, Bluedit, Post, User } from "@prisma/client"

const prisma = new PrismaClient()

const main = async () => {
  await prisma.bluedit.create({
    data: { name: "memes", description: "A Bluedit dedicated to ~Memes~ !" },
  })
  await prisma.bluedit.create({
    data: {
      name: "programmation",
      description: "A place to post question, articles, projects about programmation.",
    },
  })
  await prisma.bluedit.create({
    data: {
      name: "question",
      description: "Ask questions, get answers. Put [SERIOUS] if you only want serious answers.",
    },
  })
  await prisma.bluedit.create({
    data: {
      name: "about",
      description: "Ask questions, discover informations and talk about this project: Bluedit !",
    },
  })
}

main()
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect()
  })

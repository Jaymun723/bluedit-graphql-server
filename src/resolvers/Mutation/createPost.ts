import { MutationResolvers, ContentType } from "../../generated/graphql"
import { getUserId, trendingFormula, storeImage } from "../../utils"
import { titleValidator } from "../../validators"
import { getInfo } from "../../websitePreviewer"
import { FileUpload } from "graphql-upload"
// import * as fs from "fs"
// import * as path from "path"
// import { STATIC_DIR, SERVER_URL } from "../.."
// import { randomBytes } from "crypto"

export const createPost: MutationResolvers["createPost"] = async (parent, { input: args }, ctx, info) => {
  const userId = await getUserId(ctx)

  const title = titleValidator(args.title)
  const postExist = await ctx.prisma.post.findUnique({ where: { title } })
  if (postExist) {
    throw new Error("Title already used.")
  }

  const blueditExist = await ctx.prisma.bluedit.findUnique({ where: { id: args.blueditId } })
  if (!blueditExist) {
    throw new Error("Unable to find this bluedit.")
  }

  let content: string
  if (args.contentType === ContentType.Link) {
    if (!args.textContent) {
      throw new Error("Error no text content provided when creating a link post.")
    }
    const infos = await getInfo(args.textContent)
    content = JSON.stringify(infos)
  } else if (args.contentType === ContentType.Text) {
    if (!args.textContent) {
      throw new Error("Error no text content provided when creating a text post.")
    }
    content = args.textContent
  } else {
    if (!args.fileContent) {
      throw new Error("Error no file content provided when creating a image post.")
    }
    const { filename, mimetype, createReadStream } = (await args.fileContent) as FileUpload

    if (!mimetype.startsWith("image/")) {
      throw new Error("Please upload an image.")
    }
    const imageStream = createReadStream()

    content = await storeImage(imageStream)

    // const incomingStream = createReadStream()

    // const fileIdentifier = `${randomBytes(10).toString("hex")}-${filename}`
    // const fileStream = fs.createWriteStream(path.join(STATIC_DIR, fileIdentifier))

    // incomingStream.pipe(fileStream)

    // content = `${SERVER_URL}/static/${fileIdentifier}`
  }

  return ctx.prisma.post.create({
    data: {
      author: {
        connect: {
          id: userId,
        },
      },
      bluedit: {
        connect: {
          id: args.blueditId,
        },
      },
      content,
      title,
      contentType: args.contentType,
      trendingScore: trendingFormula(0, new Date()),
    },
  })
}

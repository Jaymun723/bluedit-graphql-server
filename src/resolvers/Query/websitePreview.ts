import { QueryResolvers } from "../../generated/graphql"
import { getInfo } from "../../websitePreviewer"

export const websitePreview: QueryResolvers["websitePreview"] = async (parent, args, ctx, info) => {
  const infos = await getInfo(args.url)

  return JSON.stringify(infos)
}

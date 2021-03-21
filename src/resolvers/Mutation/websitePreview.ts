import { MutationResolvers } from "../../generated/graphql"
import { getInfo } from "../../websitePreviewer"

export const websitePreview: MutationResolvers["websitePreview"] = async (parent, args, ctx, info) => {
  const infos = await getInfo(args.url)

  return JSON.stringify(infos)
}

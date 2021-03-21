import { SearchResultResolvers } from "../generated/graphql"

export const searchResultResolver: SearchResultResolvers = {
  __resolveType: (parent, ctx, info) => {
    if ("bio" in parent) {
      return "User"
    } else if ("title" in parent) {
      return "Post"
    } else {
      return "Bluedit"
    }
  },
}

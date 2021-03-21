import { Resolvers } from "../generated/graphql"
import { blueditResolver } from "./Bluedit"
import { commentResolver } from "./Comment"
import { postResolver } from "./Post"
import { queryResolver } from "./Query"
import { userResolver } from "./User"
import { voteResolver } from "././Vote"
import { mutationResolver } from "./Mutation"
import { dateTimeResolver } from "./DateTime"
import { searchResultResolver } from "./SearchResult"

export const resolvers: Resolvers = {
  Bluedit: blueditResolver,
  Comment: commentResolver,
  Post: postResolver,
  Query: queryResolver,
  User: userResolver,
  Vote: voteResolver,
  Mutation: mutationResolver,
  DateTime: dateTimeResolver as any,
  SearchResult: searchResultResolver,
  // Upload: GraphQLUpload as any,
}

import { QueryResolvers } from "../../generated/graphql"
import { users } from "./users"
import { me } from "./me"
import { bluedits } from "./bluedits"
import { mainFeed } from "./mainFeed"
import { blueditFeed } from "./blueditFeed"
import { personalFeed } from "./personalFeed"
import { search } from "./search"
import { bluedit } from "./bluedit"
import { user } from "./user"
import { post } from "./post"
import { postComments } from "./postComments"
import { comment } from "./comment"

export const queryResolver: QueryResolvers = {
  users,
  me,
  bluedits,
  bluedit,
  mainFeed,
  blueditFeed,
  personalFeed,
  search,
  user,
  post,
  postComments,
  comment,
}

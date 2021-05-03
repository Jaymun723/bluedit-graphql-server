import { MutationResolvers } from "../../generated/graphql"
import { createAccount } from "./createAccount"
import { login } from "./login"
import { subscribe } from "./subscribe"
import { unsubscribe } from "./unsubscribe"
import { changeAccountSettings } from "./changeAccountSettings"
import { createPost } from "./createPost"
import { removePost } from "./removePost"
import { vote } from "./vote"
import { comment } from "./comment"
import { editComment } from "./editComment"
import { removeComment } from "./removeComment"
import { editTextPost } from "./editTextPost"

export const mutationResolver: MutationResolvers = {
  createAccount,
  login,
  subscribe,
  unsubscribe,
  changeAccountSettings,
  createPost,
  removePost,
  vote,
  comment,
  editComment,
  removeComment,
  editTextPost,
}

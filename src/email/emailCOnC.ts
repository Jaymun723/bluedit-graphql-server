import { Post, Comment } from "@prisma/client"
import { BASE_URL, sendMail, urlBuilder } from "."
import { prisma } from "../graphql"
import { getCommentOnCommentHtml } from "./generated/commentOnComment"

interface COnCOptions {
  post: Post
  newComment: Comment
  previousComment: Comment
}

export const sendCOnC = async ({ newComment, previousComment, post }: COnCOptions) => {
  const commenter = (await prisma.user.findUnique({ where: { id: newComment.authorId } }))!
  const author = (await prisma.user.findUnique({ where: { id: previousComment.authorId } }))!

  if (!author.emailOnComment) return

  const substitutions = {
    $url$: BASE_URL,
    $author$: `/u/${author.name}`,
    $author_url$: urlBuilder(author.name, "user"),
    $post_title$: post.title,
    $post_url$: urlBuilder(post.id, "post"),
    $previous_content$: previousComment.content,
    $commenter$: `/u/${commenter.name}`,
    $comment$: newComment.content,
    $commenter_url$: urlBuilder(commenter.name, "user"),
    $settings_url$: `${BASE_URL}account-settings`,
  }

  const htmlContent = getCommentOnCommentHtml(substitutions)

  await sendMail({
    htmlContent,
    sender: { email: "jaymun723@yahoo.com", name: "Bluedit" },
    subject: `New comment on the post "${post.title}"`,
    to: [{ email: author.email, name: author.name }],
  })
}

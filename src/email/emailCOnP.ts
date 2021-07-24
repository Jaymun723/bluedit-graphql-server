import { Post, Comment } from "@prisma/client"
import { BASE_URL, sendMail, urlBuilder } from "."
// import nodemailer from "nodemailer"
import { prisma } from "../graphql"
import { getCommentOnPostHtml } from "./generated/commentOnPost"

interface ConPOptions {
  post: Post
  comment: Comment
}

export const sendCOnP = async ({ comment, post }: ConPOptions) => {
  const commenter = (await prisma.user.findUnique({ where: { id: comment.authorId } }))!
  const author = (await prisma.user.findUnique({ where: { id: post.authorId } }))!

  const substitutions = {
    $url$: BASE_URL,
    $author$: `/u/${author.name}`,
    $author_url$: urlBuilder(author.name, "user"),
    $post_title$: post.title,
    $post_url$: urlBuilder(post.id, "post"),
    $commenter$: `/u/${commenter.name}`,
    $comment$: comment.content,
    $commenter_url$: urlBuilder(commenter.name, "user"),
    $settings_url$: `${BASE_URL}account-settings`,
  }

  const htmlContent = getCommentOnPostHtml(substitutions)

  await sendMail({
    htmlContent,
    sender: { email: "jaymun723@yahoo.com", name: "Bluedit" },
    subject: `New comment on the post "${post.title}"`,
    to: [{ email: author.email, name: author.name }],
  })
}

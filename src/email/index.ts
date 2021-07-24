import fetch from "node-fetch"

export const BASE_URL = process.env["BASE_URL"]!

export const urlBuilder = (id: string, type: "post" | "comment" | "user", commentId?: string) => {
  let url = BASE_URL
  switch (type) {
    case "post":
    case "comment":
      url += "p/"
      break
    case "user":
      url += "u/"
      break
  }
  url += id
  if (type === "comment" && commentId) {
    url += `#${commentId}`
  }
  return url
}

const apiUrl = "https://api.sendinblue.com/v3/smtp/email"

interface SendMailOptions {
  sender: { name: string; email: string }
  to: { email: string; name: string }[]
  htmlContent: string
  subject: string
}

export const sendMail = async (body: SendMailOptions) => {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": process.env["SIB_API_KEY"]!,
    },
    body: JSON.stringify(body),
  }

  const res = await fetch(apiUrl, options)

  const json = await res.json()

  return json
}

export * from "./emailCOnC"
export * from "./emailCOnP"

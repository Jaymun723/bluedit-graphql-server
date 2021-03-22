import * as cheerio from "cheerio"
import fetch from "node-fetch"

export const getInfo = async (url: string) => {
  const res = await fetch(url)
  const html = await res.text()

  const $ = cheerio.load(html)

  const title = $("[property='og:title']").attr("content") || $("title").text()
  const description = $("[property='og:description']").attr("content") || $("[name='description']").attr("content")
  const siteUrl = $("[property='og:url']").attr("content") || $("link[rel='canonical']").attr("href") || url
  const imageUrl = $("[property='og:image']").attr("content")

  return {
    title,
    description,
    siteUrl,
    imageUrl,
  }
}

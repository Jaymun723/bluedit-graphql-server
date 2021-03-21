import * as cheerio from "cheerio"
import puppeter from "puppeteer"

export const getInfo = async (url: string) => {
  const browser = await puppeter.launch()
  const page = await browser.newPage()
  await page.goto(url)
  const html = await page.content()

  const close = browser.close()

  const $ = cheerio.load(html)

  console.log($("title").text())

  const title = $("[property='og:title']").attr("content") || $("title").text()
  const description = $("[property='og:description']").attr("content") || $("[name='description']").attr("content")
  const siteUrl = $("[property='og:url']").attr("content") || $("link[rel='canonical']").attr("href") || url
  const imageUrl = $("[property='og:image']").attr("content")

  await close

  // const title = "test"
  // const description = "test"
  // const siteUrl = "test"
  // const imageUrl = "test"

  return {
    title,
    description,
    siteUrl,
    imageUrl,
  }
}

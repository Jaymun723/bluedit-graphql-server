// @ts-ignore
import heml from "heml"
import fs from "fs/promises"
import path from "path"
import { capitalized } from "../utils"

const buildTemplates = async () => {
  const files = await fs.readdir(path.join(__dirname, "templates"))

  for (const file of files) {
    const content = await fs.readFile(path.join(__dirname, "templates", file), {
      encoding: "utf-8",
    })
    const { html } = await heml(content)
    const name = file.replace(".heml", "")
    const outFile = `import { escapeStringRegexp } from "../../utils"

export const get${capitalized(name)}Html = (s: { [key: string]: string }) => {
  let html = \`${html}\`

  for (const key in s) {
    const regex = new RegExp(escapeStringRegexp(key), "g")
    html = html.replace(regex, s[key])
  }

  return html
}`
    await fs.writeFile(path.join(__dirname, "generated", `${name}.ts`), outFile)
  }
}

buildTemplates()

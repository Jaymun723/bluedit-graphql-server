import { VercelResponse } from "@vercel/node"

export const setHeaders = (res: VercelResponse, headers: Record<string, any>): void => {
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value)
  }
}

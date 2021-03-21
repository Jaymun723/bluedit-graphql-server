import { config } from "dotenv"
import * as path from "path"

config({ path: path.resolve(__dirname, "../prisma/.env") })

import { server } from "./expressServer"

const main = async () => {
  server.listen(4000, () => {
    console.log(`Server running on http://localhost:4000`)
  })
}

main()

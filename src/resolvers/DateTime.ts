import { Kind } from "graphql"
import { DateTimeScalarConfig } from "../generated/graphql"

export const dateTimeResolver: DateTimeScalarConfig = {
  name: "DateTime",
  description: "Date custom scalar type",
  parseValue(value) {
    console.log("parseValue", value)
    return new Date(value) // value from the client
  },
  serialize(value) {
    return value
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value
    }
    return null
  },
}

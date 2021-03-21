import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

export default {
  input: "src/graphql.ts",
  output: {
    dir: "api",
    format: "cjs",
    compact: true,
  },
  plugins: [typescript({ module: "esnext", outDir: "api" }), terser()],
}

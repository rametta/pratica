import typescriptPlugin from "rollup-plugin-typescript2"
import typescript from "typescript"

export default {
  input: "src/index.ts",
  output: [
    {
      name: "pratica",
      format: "cjs",
      file: "dist/index.cjs",
    },
    {
      name: "pratica",
      format: "es",
      file: "dist/index.esm.js",
    },
  ],
  plugins: [typescriptPlugin({ typescript, tsconfig: "tsconfig.build.json" })],
}

import typescript from 'rollup-plugin-typescript2'
import { RollupOptions } from "rollup";

/** @type {RollupOptions} */
export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'pratica',
      format: 'cjs',
      file: 'dist/index.cjs'
    },
    {
      name: 'pratica',
      format: 'es',
      file: 'dist/index.esm.js'
    }
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    })
  ],
} 
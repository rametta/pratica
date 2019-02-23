import babel from 'rollup-plugin-babel'
import multiEntry from "rollup-plugin-multi-entry"

export default {
  input: 'src/**/*.js',
  output: {
    name: 'pratica',
    format: 'esm',
    file: 'dist/index.js'
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    multiEntry()
  ],
}
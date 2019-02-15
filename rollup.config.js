import babel from 'rollup-plugin-babel'
import multiEntry from "rollup-plugin-multi-entry"
import { uglify } from "rollup-plugin-uglify"

export default {
  input: 'src/**/*.js',
  output: {
    name: 'pratica',
    format: 'umd',
    file: 'dist/index.js',
    // sourcemap: true,
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    multiEntry(),
    uglify()
  ],
}
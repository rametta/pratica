import babel from 'rollup-plugin-babel'
import multiEntry from "rollup-plugin-multi-entry"
import cleanup from 'rollup-plugin-cleanup'

export default {
  input: 'src/**/*.js',
  output: {
    name: 'pratica',
    format: 'cjs',
    file: 'dist/index.js'
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    multiEntry(),
    cleanup()
  ],
}
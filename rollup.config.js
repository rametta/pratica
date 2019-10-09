import babel from 'rollup-plugin-babel'
import multiEntry from 'rollup-plugin-multi-entry'
import typescript from 'rollup-plugin-typescript2'
import cleanup from 'rollup-plugin-cleanup'

export default {
  input: 'src/**/*.ts',
  output: {
    name: 'pratica',
    format: 'cjs',
    file: 'dist/index.js'
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    typescript({
      typescript: require('typescript')
    }),
    multiEntry(),
    cleanup()
  ],
}
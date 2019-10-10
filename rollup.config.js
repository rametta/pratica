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
    typescript({
      typescript: require('typescript'),
      tsconfig: './tsconfig.build.json'
    }),
    multiEntry(),
    cleanup()
  ],
}
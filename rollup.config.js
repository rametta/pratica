import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    name: 'pratica',
    format: 'cjs',
    file: 'dist/index.js'
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    })
  ],
} 
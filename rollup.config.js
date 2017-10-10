import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'dist/main.js',
  plugins: [
    nodeResolve({jsnext: true, main: true}),
    commonjs(),
    cleanup(),
    uglify()
  ],
  exports: 'named',
  name: 'Refractive',
  output: {
    file: 'dist/bundle.js',
    format: 'umd'
  }
}

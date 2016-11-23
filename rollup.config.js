import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'dist/main.js',
  format: 'umd',
  plugins: [
    nodeResolve({jsnext: true, main: true}),
    commonjs(),
    cleanup(),
    uglify()
  ],
  exports: 'named',
  moduleName: 'martinetto',
  dest: 'dist/bundle.js'
}

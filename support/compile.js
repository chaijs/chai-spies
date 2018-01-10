import commonjs from 'rollup-plugin-commonjs';

const MODULE_NAME = '__chaiSpies__'

function replaceGlobalExportWithChaiUse() {
  return {
    name: 'chai-use',

    transformBundle(source, options) {
      return source.replace(
        new RegExp(`global.${MODULE_NAME} *= *factory\\(\\)`),
        [
          '(function() {',
            'if (!global.chai) throw new Error("Chai cannot be found in current scope.");',
            'global.chai.use(factory());',
          '})()'
        ].join('')
      )
    }
  }
}

export default {
  input: 'lib/spy.js',
  output: {
    format: 'umd',
    name: MODULE_NAME,
    file: './chai-spies.js'
  },
  plugins: [
    commonjs(),
    replaceGlobalExportWithChaiUse()
  ]
};

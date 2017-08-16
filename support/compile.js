import commonjs from 'rollup-plugin-commonjs';

const MODULE_NAME = '__chaiSpies__'

function injectChaiPresenceCheck() {
  return {
    name: 'chai-presence-check',

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
  entry: 'lib/spy.js',
  dest: './chai-spies.js',
  format: 'umd',
  exports: 'default',
  moduleName: MODULE_NAME,
  plugins: [
    commonjs(),
    injectChaiPresenceCheck()
  ]
};

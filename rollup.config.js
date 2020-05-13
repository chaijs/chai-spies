import commonjs from '@rollup/plugin-commonjs';

const MODULE_NAME = '__chaiSpies__';

function replaceGlobalExportWithChaiUse() {
  const moduleRegexp = new RegExp(`global.${MODULE_NAME} *= *factory\\(\\)`);
  const usePluginCode = [
    '(function() {',
      'if (!global.chai) throw new Error("global.chai is not defined");',
      'global.chai.use(factory());',
    '})()'
  ].join('');

  return {
    name: 'chai-use',
    renderChunk(code) {
      return {
        code: code.replace(moduleRegexp, usePluginCode),
        map: { mappings: '' },
      };
    }
  }
}

export default {
  input: 'lib/spy.js',
  output: {
    format: 'umd',
    name: MODULE_NAME,
    file: './chai-spies.js',
    plugins: [
      replaceGlobalExportWithChaiUse()
    ]
  },
  plugins: [
    commonjs(),
  ]
};

const { terser } = require('rollup-plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const { default: nodeResolve } = require('@rollup/plugin-node-resolve');

/**
 * @returns {import('rollup').RollupOptions}
 */
const createBaseRollupConfig = () => ({
  input: 'src/index.ts',
  output: {
    format: 'cjs',
    name: 'version',
    plugins: [terser()],
    file: 'dist/index.min.js',
  },
  plugins: [
    typescript(),
    nodeResolve(),
  ],
});

module.exports = { createBaseRollupConfig };

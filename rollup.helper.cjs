const { terser } = require('rollup-plugin-terser');
const typescript = require('@rollup/plugin-typescript');

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
  ],
});

module.exports = { createBaseRollupConfig };

import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { createBaseRollupConfig } from '../../rollup.helper';

const baseRollupConfig = createBaseRollupConfig();

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    ...baseRollupConfig,
    input: 'src/index.ts',
    output: {
      ...baseRollupConfig.output,
      format: 'cjs',
      file: 'dist/index.min.js',
    },
    plugins: [...baseRollupConfig.plugins, json()],
    external: ['@angular/compiler'],
  },
  {
    ...baseRollupConfig,
    input: 'src/schematics.ts',
    output: {
      ...baseRollupConfig.output,
      format: 'cjs',
      file: 'dist/schematics/index.js',
    },
    plugins: [...baseRollupConfig.plugins, json(), commonjs()],
  },
];

export default config;

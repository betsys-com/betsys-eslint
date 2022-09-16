import json from '@rollup/plugin-json';
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
      exports: 'default',
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
    plugins: [...baseRollupConfig.plugins, json()],
  },
];

export default config;

import json from '@rollup/plugin-json';
import { createBaseRollupConfig } from '../../rollup.helper';

const baseRollupConfig = createBaseRollupConfig();
const baseConfig = {
  ...baseRollupConfig,
  plugins: [...baseRollupConfig.plugins, json()],
  external: [
    'child_process',
    'fs',
    'path',
    'url',
    'process',
  ],
};

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  baseConfig,
  {
    ...baseConfig,
    input: 'src/cli.ts',
    output: {
      ...baseConfig.output,
      format: 'esm',
      file: 'dist/cli.min.js',
      banner: '#!/usr/bin/env node'
    },
  }
];

export default config;

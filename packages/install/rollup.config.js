import json from '@rollup/plugin-json';
import { createBaseRollupConfig } from '../../rollup.helper';

const baseRollupConfig = createBaseRollupConfig();

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  ...baseRollupConfig,
  input: 'src/cli.ts',
  output: {
    ...baseRollupConfig.output,
    format: 'esm',
    file: 'dist/cli.min.js',
    banner: '#!/usr/bin/env node'
  },
  plugins: [...baseRollupConfig.plugins, json()],
  external: [
    'child_process',
    'fs',
    'path',
    'url',
    'process',
    'chalk',
    'resolve-package-path'
  ],
};

export default config;

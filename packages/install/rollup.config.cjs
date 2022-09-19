const json = require('@rollup/plugin-json');
const { createBaseRollupConfig } = require('../../rollup.helper.cjs');
const { default: nodeResolve } = require('@rollup/plugin-node-resolve');
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
        file: 'dist/cli.min.cjs',
        banner: '#!/usr/bin/env node'
    },
    plugins: [...baseRollupConfig.plugins, json(), nodeResolve()],
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

module.exports = config;

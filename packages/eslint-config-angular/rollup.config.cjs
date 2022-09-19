const json = require('@rollup/plugin-json');
const { createBaseRollupConfig } = require('../../rollup.helper.cjs');
const baseRollupConfig = createBaseRollupConfig();

/**
 * @type {import('rollup').RollupOptions[]}
 */
const configs = [
    {
        ...baseRollupConfig,
        input: 'src/index.ts',
        output: {
            ...baseRollupConfig.output,
            format: 'cjs',
            exports: 'default',
            file: 'dist/index.min.cjs',
        },
        external: ['@typescript-eslint/utils'],
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

module.exports = configs;

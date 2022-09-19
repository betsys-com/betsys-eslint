const { resolve } = require('path');
const { readdirSync } = require('fs');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
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
    ...readdirSync(resolve('./src/rules')).map(filename => ({
        ...baseRollupConfig,
        input: `src/rules/${filename}`,
        output: {
            ...baseRollupConfig.output,
            format: 'cjs',
            exports: 'default',
            file: `dist/rules/${filename.replace('.ts', '.cjs')}`,
        },
        plugins: [ ...baseRollupConfig.plugins, commonjs() ],
        external: ['@typescript-eslint/utils'],
    })),
];

module.exports = configs;

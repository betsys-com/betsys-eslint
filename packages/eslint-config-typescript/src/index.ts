import type { TSESLint } from '@typescript-eslint/utils';

const config: TSESLint.Linter.Config = {
    extends: [
        'plugin:@typescript-eslint/recommended',
        './rules/best-practices.cjs',
        './rules/es-next.cjs',
        './rules/errors.cjs',
        './rules/import.cjs',
        './rules/style.cjs',
        './rules/variables.cjs',
    ],
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['node_modules', 'dist'],
    parserOptions: {
        project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint'],
};

// eslint-disable-next-line import/no-default-export
export default config;

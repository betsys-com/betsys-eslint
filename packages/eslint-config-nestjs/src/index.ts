import type { TSESLint } from '@typescript-eslint/utils';

const config: TSESLint.Linter.Config = {
    extends: [
        '@betsys-eslint/typescript',
    ],
};

// eslint-disable-next-line import/no-default-export
export default config;

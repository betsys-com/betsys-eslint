import type { TSESLint } from '@typescript-eslint/utils';

const config: TSESLint.Linter.Config = {
    extends: [
        '@betsys-eslint/typescript',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
    ],
};

// eslint-disable-next-line import/no-default-export
export default config;

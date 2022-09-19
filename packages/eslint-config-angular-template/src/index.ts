import type { TSESLint } from '@typescript-eslint/utils';
import { overridesRules } from '@package/src/rules/overrides.rules';

const config: TSESLint.Linter.Config = {
    extends: [
        'plugin:@angular-eslint/template/recommended',
        'plugin:@betsys-eslint/angular-template-spacing/recommended',
    ],
    plugins: [
        '@betsys-eslint/angular-template-spacing',
    ],
    rules: {
        ...overridesRules,
    },
};

// eslint-disable-next-line import/no-default-export
export default config;

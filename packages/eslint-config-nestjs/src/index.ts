import type { TSESLint } from '@typescript-eslint/utils';
import { overridesRules } from '@package/src/rules/overrides.rules';

const config: TSESLint.Linter.Config = {
    extends: [
        '@betsys-eslint/typescript',
    ],
    rules: {
        ...overridesRules,
    },
};

// eslint-disable-next-line import/no-default-export
export default config;

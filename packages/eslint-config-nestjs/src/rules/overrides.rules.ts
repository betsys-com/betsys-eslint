/* eslint-disable @typescript-eslint/naming-convention */
import type { TSESLint } from '@typescript-eslint/utils';

export const overridesRules: TSESLint.Linter.RulesRecord = {
    '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'no-public',
        overrides: {
            constructors: 'no-public',
        },
    }],
};

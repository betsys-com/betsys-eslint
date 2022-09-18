/* eslint-disable @typescript-eslint/naming-convention */
import { TSESLint } from '@typescript-eslint/utils';
import confusingBrowserGlobals from 'confusing-browser-globals';

const config: TSESLint.Linter.Config = {
    rules: {
        // enforce or disallow variable initializations at definition
        'init-declarations': 'off',

        // disallow the catch clause parameter name being the same as a variable in the outer scope
        'no-catch-shadow': 'off',

        // disallow deletion of variables
        'no-delete-var': 'error',

        // disallow labels that share a name with a variable
        // https://eslint.org/docs/rules/no-label-var
        'no-label-var': 'error',

        // disallow specific globals
        'no-restricted-globals': [
            'error',
            {
                name: 'isFinite',
                message:
          'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
            },
            {
                name: 'isNaN',
                message:
          'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
            },
            ...confusingBrowserGlobals,
        ],

        // disallow declaration of variables already declared in the outer scope
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',

        // disallow shadowing of names such as arguments
        'no-shadow-restricted-names': 'error',

        // disallow use of undeclared variables unless mentioned in a /*global */ block
        // this rule is already checked by @typescript-eslint
        'no-undef': 'off',

        // disallow use of undefined when initializing variables
        'no-undef-init': 'off',

        // disallow use of undefined variable
        // https://eslint.org/docs/rules/no-undefined
        'no-undefined': 'off',

        // disallow declaration of variables that are not used in the code
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],

        // disallow use of variables before they are defined
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
    },
};

// eslint-disable-next-line import/no-default-export
export default config;

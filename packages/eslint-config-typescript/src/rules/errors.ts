/* eslint-disable @typescript-eslint/naming-convention */
import type { TSESLint } from '@typescript-eslint/utils';

const config: TSESLint.Linter.Config = {
    rules: {
        // Enforce “for” loop update clause moving the counter in the right direction
        // https://eslint.org/docs/rules/for-direction
        'for-direction': 'error',

        // Enforces that a return statement is present in property getters
        // this rule is already checked by @typescript-eslint
        // https://eslint.org/docs/rules/getter-return
        'getter-return': 'off',

        // disallow using an async function as a Promise executor
        // https://eslint.org/docs/rules/no-async-promise-executor
        'no-async-promise-executor': 'error',

        // Disallow await inside of loops
        // https://eslint.org/docs/rules/no-await-in-loop
        'no-await-in-loop': 'error',

        // Disallow comparisons to negative zero
        // https://eslint.org/docs/rules/no-compare-neg-zero
        'no-compare-neg-zero': 'error',

        // disallow assignment in conditional expressions
        'no-cond-assign': ['error', 'always'],

        // disallow use of console
        'no-console': [
            'error',
            {
                allow: [
                    'warn',
                    'dir',
                    'timeLog',
                    'assert',
                    'clear',
                    'count',
                    'countReset',
                    'group',
                    'groupEnd',
                    'table',
                    'dirxml',
                    'error',
                    'groupCollapsed',
                    'Console',
                    'profile',
                    'profileEnd',
                    'timeStamp',
                    'context',
                ],
            },
        ],

        // Disallows expressions where the operation doesn't affect the value
        // https://eslint.org/docs/rules/no-constant-binary-expression
        'no-constant-binary-expression': 'off',

        // disallow use of constant expressions in conditions
        'no-constant-condition': 'warn',

        // disallow control characters in regular expressions
        'no-control-regex': 'error',

        // disallow use of debugger
        'no-debugger': 'error',

        // disallow duplicate arguments in functions
        // this rule is already checked by @typescript-eslint
        'no-dupe-args': 'off',

        // Disallow duplicate conditions in if-else-if chains
        // https://eslint.org/docs/rules/no-dupe-else-if
        'no-dupe-else-if': 'error',

        // disallow duplicate keys when creating object literals
        // this rule is already checked by @typescript-eslint
        'no-dupe-keys': 'off',

        // disallow a duplicate case label.
        'no-duplicate-case': 'error',

        // disallow empty statements
        'no-empty': 'off',

        // disallow the use of empty character classes in regular expressions
        'no-empty-character-class': 'error',

        // disallow assigning to the exception in a catch block
        'no-ex-assign': 'error',

        // disallow double-negation boolean casts in a boolean context
        // https://eslint.org/docs/rules/no-extra-boolean-cast
        'no-extra-boolean-cast': 'error',

        // disallow unnecessary parentheses
        // https://eslint.org/docs/rules/no-extra-parens
        'no-extra-parens': 'off',
        '@typescript-eslint/no-extra-parens': ['off', 'all', {
            conditionalAssign: true,
            nestedBinaryExpressions: false,
            returnAssign: false,
            ignoreJSX: 'all', // delegate to eslint-plugin-react
            enforceForArrowConditionals: false,
        }],

        // disallow unnecessary semicolons
        'no-extra-semi': 'off',
        '@typescript-eslint/no-extra-semi': 'error',

        // disallow overwriting functions written as function declarations
        // this rule is already checked by @typescript-eslint
        'no-func-assign': 'off',

        // https://eslint.org/docs/rules/no-import-assign
        // this rule is already checked by @typescript-eslint
        'no-import-assign': 'off',

        // disallow function or variable declarations in nested blocks
        'no-inner-declarations': 'error',

        // disallow invalid regular expression strings in the RegExp constructor
        'no-invalid-regexp': 'error',

        // disallow irregular whitespace outside of strings and comments
        'no-irregular-whitespace': 'error',

        // Disallow Number Literals That Lose Precision
        // https://eslint.org/docs/rules/no-loss-of-precision
        'no-loss-of-precision': 'off',
        '@typescript-eslint/no-loss-of-precision': 'error',

        // Disallow characters which are made with multiple code points in character class syntax
        // https://eslint.org/docs/rules/no-misleading-character-class
        'no-misleading-character-class': 'error',

        // disallow the use of object properties of the global object (Math and JSON) as functions
        // this rule is already checked by @typescript-eslint
        'no-obj-calls': 'off',

        // Disallow returning values from Promise executor functions
        // https://eslint.org/docs/rules/no-promise-executor-return
        'no-promise-executor-return': 'error',

        // disallow use of Object.prototypes builtins directly
        // https://eslint.org/docs/rules/no-prototype-builtins
        'no-prototype-builtins': 'error',

        // disallow multiple spaces in a regular expression literal
        'no-regex-spaces': 'error',

        // Disallow returning values from setters
        // https://eslint.org/docs/rules/no-setter-return
        // this rule is already checked by @typescript-eslint
        'no-setter-return': 'off',

        // disallow sparse arrays
        'no-sparse-arrays': 'error',

        // Disallow template literal placeholder syntax in regular strings
        // https://eslint.org/docs/rules/no-template-curly-in-string
        'no-template-curly-in-string': 'error',

        // Avoid code that looks like two expressions but is actually one
        // https://eslint.org/docs/rules/no-unexpected-multiline
        'no-unexpected-multiline': 'error',

        // disallow unreachable statements after a return, throw, continue, or break statement
        // this rule is already checked by @typescript-eslint
        'no-unreachable': 'off',

        // Disallow loops with a body that allows only one iteration
        // https://eslint.org/docs/rules/no-unreachable-loop
        'no-unreachable-loop': ['error', {
            ignore: [], // WhileStatement, DoWhileStatement, ForStatement, ForInStatement, ForOfStatement
        }],

        // disallow return/throw/break/continue inside finally blocks
        // https://eslint.org/docs/rules/no-unsafe-finally
        'no-unsafe-finally': 'error',

        // disallow negating the left operand of relational operators
        // https://eslint.org/docs/rules/no-unsafe-negation
        // this rule is already checked by @typescript-eslint
        'no-unsafe-negation': 'off',

        // disallow use of optional chaining in contexts where the undefined value is not allowed
        // https://eslint.org/docs/rules/no-unsafe-optional-chaining
        'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],

        // Disallow Unused Private Class Members
        // https://eslint.org/docs/rules/no-unused-private-class-members
        'no-unused-private-class-members': 'off',

        // Disallow useless backreferences in regular expressions
        // https://eslint.org/docs/rules/no-useless-backreference
        'no-useless-backreference': 'error',

        // disallow negation of the left operand of an in expression
        // deprecated in favor of no-unsafe-negation
        'no-negated-in-lhs': 'off',

        // Disallow assignments that can lead to race conditions due to usage of await or yield
        // https://eslint.org/docs/rules/require-atomic-updates
        // note: not enabled because it is very buggy
        'require-atomic-updates': 'off',

        // disallow comparisons with the value NaN
        'use-isnan': 'error',

        // ensure JSDoc comments are valid
        // https://eslint.org/docs/rules/valid-jsdoc
        'valid-jsdoc': 'off',

        // ensure that the results of typeof are compared against a valid string
        // https://eslint.org/docs/rules/valid-typeof
        // this rule is already checked by @typescript-eslint
        'valid-typeof': 'off',
    },
};

// eslint-disable-next-line import/no-default-export
export default config;

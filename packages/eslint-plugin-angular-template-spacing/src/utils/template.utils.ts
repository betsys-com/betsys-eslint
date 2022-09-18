import type { TSESLint } from '@typescript-eslint/utils';

const inlineTemplateRegex = /.*inline-template.*\.component\.html$/g;
export const isInlineTemplate = (
    context: TSESLint.RuleContext<string, unknown[]>,
): boolean => inlineTemplateRegex.test(context.getFilename());

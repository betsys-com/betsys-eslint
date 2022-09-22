import { RuleValue } from '@package/src/models/options.model';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { isInlineTemplate } from '@package/src/utils/template.utils';
import { InterpolationSpacer } from '@package/src/spacers/interpolation.spacer';
import type { InterpolationRuleOptions } from '@package/src/models/options.model';
import { covertToInterpolationNodes } from '@package/src/utils/interpolation.utils';
import type { BoundText, InterpolationNode } from '@package/src/models/interpolation.model';

type ModuleType = TSESLint.RuleModule<string, InterpolationRuleOptions>;

function createReportWithoutLocation(
    context: Parameters<ModuleType['create']>[0],
    node: BoundText,
    messageId: string,
): void {
    return context.report({ node: node as unknown as TSESTree.Node, messageId });
}

function createReport(
    context: Parameters<ModuleType['create']>[0],
    node: InterpolationNode,
    messageId: string,
): (fix?: TSESLint.ReportFixFunction) => void {
    return (fix) => context.report({ loc: node.location, messageId, fix });
}

export const ruleName = 'interpolation';
export const ruleModule: ModuleType = {
    defaultOptions: [RuleValue.Always, { allowNewlines: true }],
    meta: {
        type: 'suggestion',
        fixable: 'whitespace',
        schema: [
            {
                enum: ['always', 'never'],
            },
            {
                type: 'object',
                properties: {
                    allowNewlines: {
                        default: true,
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
        docs: {
            description: 'Checks interpolation whitespace in Angular templates',
            recommended: 'error',
        },
        messages: {
            whitespaceExtra: 'whitespace in interpolation',
            whitespaceMissing: 'missing whitespace in interpolation',
        },
    },
    create(context) {
        const { options } = context as unknown as { options: InterpolationRuleOptions };
        const expectWhitespace = (options?.[0] ?? RuleValue.Always) === RuleValue.Always;
        const { allowNewlines = true } = options?.[1] ?? {};

        const spacer = new InterpolationSpacer(expectWhitespace, allowNewlines);
        const isInlineTmpl = isInlineTemplate(context);
        const messageId = expectWhitespace ? 'whitespaceMissing' : 'whitespaceExtra';

        return {
            BoundText(boundText: BoundText & { parent: unknown }) {
                if (boundText.value?.ast?.type !== 'Interpolation') {
                    return;
                }

                // eslint-disable-next-line no-restricted-syntax
                for (const interpolationNode of covertToInterpolationNodes(boundText)) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const node of spacer.getIncorrectNodesWithAbsoluteLocation(interpolationNode)) {
                        if (isInlineTmpl) {
                            createReportWithoutLocation(context, boundText, messageId);

                            return;
                        }

                        createReport(context, node, messageId)((fixer) => fixer.replaceTextRange(
                            expectWhitespace ? [node.offset, node.offset] : [node.offset, node.offset + 1],
                            expectWhitespace ? ' ' : '',
                        ));
                    }
                }
            },
        };
    },
};

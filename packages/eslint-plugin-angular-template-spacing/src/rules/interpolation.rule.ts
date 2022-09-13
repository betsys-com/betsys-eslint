import { RuleValue } from '@package/models/options.model';
import { isInlineTemplate } from '@package/utils/template.utils';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { InterpolationSpacer } from '@package/spacers/interpolation.spacer';
import type { InterpolationRuleOptions } from '@package/models/options.model';
import { covertToInterpolationNodes } from '@package/utils/interpolation.utils';
import type { BoundText, InterpolationNode } from '@package/models/interpolation.model';

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
  return fix => context.report({ loc: node.location, messageId, fix });
}

export const ruleName = 'interpolation';
export const ruleModule: ModuleType = {
  defaultOptions: [RuleValue.Always, { allowNewlines: false }],
  meta: {
    type: 'suggestion',
    fixable: 'whitespace',
    schema: [
      {
        enum: ['always', 'never']
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
      BoundText(boundText: BoundText & { parent: any }) {
        if (boundText.value?.ast?.type !== 'Interpolation') {
          return;
        }

        for (const interpolationNode of covertToInterpolationNodes(boundText)) {
          for (const node of spacer.getIncorrectNodesWithAbsoluteLocation(interpolationNode)) {
            if (isInlineTmpl) {
              return createReportWithoutLocation(context, boundText, messageId);
            }

            createReport(context, node, messageId)(fixer => fixer.replaceTextRange(
              expectWhitespace ? [node.offset, node.offset] : [node.offset, node.offset + 1],
              expectWhitespace ? ' ' : '',
            ));
          }
        }
      },
    };
  }
};


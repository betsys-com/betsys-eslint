import { RuleValue } from '@package/models/options.model';
import { PipeSpacer } from '@package/spacers/pipe.spacer';
import { isInlineTemplate } from '@package/utils/template.utils';
import type { BoundAttribute } from '@package/models/pipe.model';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { PipeRuleOptions } from '@package/models/options.model';
import { convertSpanToLocation } from '@package/utils/conversion.utils';
import { covertToInterpolationNodes } from '@package/utils/interpolation.utils';
import type { BoundText, InterpolationNode } from '@package/models/interpolation.model';

type ModuleType = TSESLint.RuleModule<string, PipeRuleOptions>;

function createReportWithoutLocation(
  context: Parameters<ModuleType['create']>[0],
  node: BoundText | BoundAttribute,
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

export const ruleName = 'pipe';
export const ruleModule: ModuleType = {
  defaultOptions: [RuleValue.Always],
  meta: {
    type: 'suggestion',
    fixable: 'whitespace',
    schema: [
      {
        enum: ['always', 'never']
      }
    ],
    docs: {
      description: 'Checks pipe whitespace in Angular templates',
      recommended: 'error',
    },
    messages: {
      whitespaceExtra: 'whitespace around pipe',
      whitespaceMissing: 'missing whitespace around pipe',
    },
  },
  create(context) {
    const { options } = context as unknown as { options: PipeRuleOptions };
    const expectWhitespace = (options?.[0] ?? RuleValue.Always) === RuleValue.Always;

    const spacer = new PipeSpacer(expectWhitespace);
    const isInlineTmpl = isInlineTemplate(context);
    const messageId = expectWhitespace ? 'whitespaceMissing' : 'whitespaceExtra';

    return {
      BoundText(boundText: BoundText) {
        if (boundText.value?.ast?.type !== 'Interpolation') {
          return;
        }

        for (const interpolationNode of covertToInterpolationNodes(boundText)) {
          for (const node of spacer.getIncorrectNodesWithAbsoluteLocation(interpolationNode)) {
            if (isInlineTmpl) {
              return createReportWithoutLocation(context, boundText, messageId);
            }

            createReport(context, node, expectWhitespace ? 'whitespaceMissing' : 'whitespaceExtra')(
              fixer => fixer.replaceTextRange(
                expectWhitespace ? [node.offset, node.offset] : [node.offset, node.offset + 1],
                expectWhitespace ? ' ' : '',
              ),
            );
          }
        }
      },
      BoundAttribute(attribute: BoundAttribute): void {
        const interpolationNode: InterpolationNode = {
          value: attribute.value.source ?? '',
          offset: attribute.valueSpan.start.offset,
          location: convertSpanToLocation(attribute.valueSpan),
        };

        for (const node of spacer.getIncorrectNodesWithAbsoluteLocation(interpolationNode)) {
          if (isInlineTmpl) {
            return createReportWithoutLocation(context, attribute, messageId);
          }

          createReport(context, node, expectWhitespace ? 'whitespaceMissing' : 'whitespaceExtra')(
            fixer => fixer.replaceTextRange(
              expectWhitespace ? [node.offset, node.offset] : [node.offset, node.offset + 1],
              expectWhitespace ? ' ' : '',
            ),
          );
        }
      }
    };
  }
};


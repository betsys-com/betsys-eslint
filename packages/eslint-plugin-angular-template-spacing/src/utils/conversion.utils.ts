import type { TSESTree } from '@typescript-eslint/utils';
import type { BoundAttribute } from '@package/models/pipe.model';

export function convertSpanToLocation(span: BoundAttribute['valueSpan']): TSESTree.SourceLocation {
    return {
        start: {
            column: span.start.col,
            line: span.start.line + 1,
        },
        end: {
            column: span.end.col,
            line: span.end.line + 1,
        },
    };
}

import { BoundText } from '@package/models/interpolation.model';
import type { InterpolationNode, IncompleteInterpolationNode } from '@package/models/interpolation.model';

export function* covertToInterpolationNodes(boundText: BoundText): Iterable<InterpolationNode> {
    const source = boundText.value.source ?? '';
    let line = boundText.loc?.start?.line ?? 0;
    let column = boundText.loc?.start?.column ?? 0;
    let offset = boundText.sourceSpan?.start?.offset ?? 0;

    let currentNode: IncompleteInterpolationNode | undefined = undefined;
    for (const part of source.trim().split('\n')) {
        offset += part.length || 1;
        const split = part.split('');
        for (let i = 0; i < split.length; i++) {
            const char = split[i];
            if (currentNode) {
                currentNode.value += char;
            }

            const isStart = split[i - 1] === '{' && char === '{';
            if (isStart) {
                currentNode = {
                    offset: offset - (part.length - (i - 1)),
                    value: '{{',
                    location: {
                        start: { line, column: column + i - 1 },
                    },
                };
            }

            const isLastConsecutiveEnding = split[i - 1] === '}' && char === '}' && split[i + 1] !== '}';
            if (currentNode && isLastConsecutiveEnding) {
                yield {
                    ...currentNode,
                    location: {
                        ...currentNode.location,
                        end: { line, column: column + i + 1 },
                    },
                } as InterpolationNode;
                currentNode = undefined;
            }
        }

        line += 1;
        column = 0;
        offset += 1;
        if (currentNode) currentNode.value += '\n';
    }
}

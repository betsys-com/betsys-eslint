import type { Pipe } from '@package/src/models/pipe.model';
import type { InterpolationNode } from '@package/src/models/interpolation.model';

export class PipeSpacer {
    constructor(private expectWhitespace: boolean) {}

    get checkRegExp(): RegExp {
        return this.expectWhitespace ? /[^\S\r\n]\|[^\S\r\n]/g : /\S\|\S/g;
    }

    get startCheckRegExp(): RegExp {
        return this.expectWhitespace ? /[^\S\r\n]\|./g : /\S\|./g;
    }

    get endCheckRegExp(): RegExp {
        return this.expectWhitespace ? /.\|[^\S\r\n]/g : /.\|\S/g;
    }

    private static *extractPipes(node: InterpolationNode): Iterable<Pipe> {
        let line = node.location.start.line;
        let column = node.location.start.column;
        for (let charIndex = 0; charIndex < node.value.length; charIndex++) {
            const prevChar = node.value.charAt(charIndex - 1);
            const char = node.value.charAt(charIndex);
            const nextChar = node.value.charAt(charIndex + 1);
            if (char === '\n') {
                line += 1;
                column = 0;

                continue;
            }

            if (char === '|' && prevChar && nextChar && prevChar !== char && nextChar !== char) {
                yield { offset: charIndex, value: prevChar + char + nextChar, startLocation: { line, column } };
            }

            column += 1;
        }
    }

    *getIncorrectNodesWithAbsoluteLocation(node: InterpolationNode): Iterable<InterpolationNode> {
        // eslint-disable-next-line no-restricted-syntax
        for (const pipe of PipeSpacer.extractPipes(node)) {
            if (!this.checkRegExp.test(pipe.value)) {
                if (!this.startCheckRegExp.test(pipe.value)) {
                    yield this.generateNodeWithAbsoluteLocation(node, pipe, 'start');
                }

                if (!this.endCheckRegExp.test(pipe.value)) {
                    yield this.generateNodeWithAbsoluteLocation(node, pipe, 'end');
                }
            }
        }
    }

    private generateNodeWithAbsoluteLocation(node: InterpolationNode, pipe: Pipe, relativeLocation: 'start' | 'end'): InterpolationNode {
        const isAtStart = relativeLocation === 'start';

        /* eslint-disable no-nested-ternary */
        const startColumn = pipe.startLocation.column + (isAtStart ? (this.expectWhitespace ? 0 : -1) : 1);
        const endColumn = pipe.startLocation.column + (isAtStart ? 0 : (this.expectWhitespace ? 1 : 2));
        /* eslint-enable no-nested-ternary */

        return {
            ...node,
            offset: node.offset + pipe.offset + (isAtStart ? 0 : 1),
            location: {
                start: { ...pipe.startLocation, column: startColumn },
                end: { ...pipe.startLocation, column: endColumn },
            },
        };
    }
}

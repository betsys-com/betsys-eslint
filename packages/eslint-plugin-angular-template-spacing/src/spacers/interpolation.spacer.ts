import type { InterpolationNode } from '@package/src/models/interpolation.model';

export class InterpolationSpacer {
    constructor(private expectWhitespace: boolean, private allowNewlines: boolean) {}

    get delimiter(): string {
        return this.allowNewlines ? '\\s' : '[^\\S\\r\\n]';
    }

    get checkRegExp(): RegExp {
        return this.expectWhitespace
            ? new RegExp(`^{{${this.delimiter}([\\s\\S]*?)${this.delimiter}}}$`, 'g')
            : /^\{\{\S([\s\S]*?)\S}}$/g;
    }

    get startCheckRegExp(): RegExp {
        return this.expectWhitespace ? new RegExp(`^{{${this.delimiter}([\\s\\S]*?)}}$`, 'g') : /^\{\{\S([\s\S]*?)}}$/g;
    }

    get endCheckRegExp(): RegExp {
        return this.expectWhitespace ? new RegExp(`^{{([\\s\\S]*?)${this.delimiter}}}$`, 'g') : /^\{\{([\s\S]*?)\S}}$/g;
    }

    *getIncorrectNodesWithAbsoluteLocation(node: InterpolationNode): Iterable<InterpolationNode> {
        if (!this.checkRegExp.test(node.value)) {
            if (!this.startCheckRegExp.test(node.value)) {
                yield this.generateNodeWithAbsoluteLocation(node, 'start');
            }

            if (!this.endCheckRegExp.test(node.value)) {
                yield this.generateNodeWithAbsoluteLocation(node, 'end');
            }
        }
    }

    private generateNodeWithAbsoluteLocation(node: InterpolationNode, relativeLocation: 'start' | 'end'): InterpolationNode {
        const interpolationLength = 2;

        if (relativeLocation === 'start') {
            return {
                ...node,
                offset: node.offset + interpolationLength,
                location: {
                    start: {
                        ...node.location.start,
                        column: node.location.start.column + interpolationLength,
                    },
                    end: {
                        ...node.location.start,
                        column: node.location.start.column + interpolationLength + (this.expectWhitespace ? 0 : 1),
                    },
                },
            };
        }

        const startColumn = node.location.end.column - interpolationLength - (this.expectWhitespace ? 0 : 1);
        const endColumn = node.location.end.column - interpolationLength;

        return {
            ...node,
            offset: node.offset + node.value.length - interpolationLength,
            location: {
                start: {
                    ...node.location.end,
                    column: startColumn >= 0 ? startColumn : 0,
                },
                end: {
                    ...node.location.end,
                    column: endColumn >= 0 ? endColumn : 0,
                },
            },
        };
    }
}

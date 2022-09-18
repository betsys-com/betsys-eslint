import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { BoundText } from '@package/src/models/interpolation.model';
import { ruleName, ruleModule } from '@package/src/rules/interpolation.rule';

const mockLocation = (start: [number, number], end: [number, number]): BoundText['loc'] => ({
    start: { line: start[0], column: start[1] },
    end: { line: end[0], column: end[1] },
});

const mockBoundText = (source: string, type: string, loc: BoundText['loc']): BoundText & TSESTree.BaseNode => ({
    loc,
    value: {
        source,
        ast: { type } as BoundText['value']['ast'],
    } as unknown as BoundText['value'],
}) as BoundText & TSESTree.BaseNode;

type ListenerType = TSESLint.RuleListener & { BoundText: TSESLint.RuleFunction<BoundText & TSESTree.BaseNode> };

describe('Interpolation Rule', () => {
    let listener: ListenerType;
    let context: TSESLint.RuleContext<string, []>;

    beforeEach(() => {
        context = {
            report: jest.fn(),
            getFilename: jest.fn(() => 'template.html'),
        } as unknown as TSESLint.RuleContext<string, []>;
    });

    it('should have correct name', () => {
        expect(ruleName).toBe('interpolation');
    });

    describe('BoundText Listener', () => {
        beforeEach(() => {
            listener = ruleModule.create(context) as ListenerType;
        });

        it('should exist', () => {
            expect(listener).toHaveProperty('BoundText');
        });

        describe.each([
            undefined,
            'always',
        ])('whitespace = %s', (whitespace) => {
            const fix = expect.anything();
            const messageId = 'whitespaceMissing';

            beforeEach(() => {
                context = {
                    report: jest.fn(),
                    options: [whitespace],
                    getFilename: jest.fn(() => 'template.html'),
                } as unknown as TSESLint.RuleContext<string, []>;
                listener = ruleModule.create(context) as ListenerType;
            });

            it.each([
                {
                    interpolation: '{{interpolation}}',
                    location: mockLocation([0, 0], [0, 17]),
                    locs: [mockLocation([0, 2], [0, 2]), mockLocation([0, 15], [0, 15])],
                },
                {
                    interpolation: '<div>{{interpolation}}</div>',
                    location: mockLocation([0, 0], [0, 28]),
                    locs: [mockLocation([0, 7], [0, 7]), mockLocation([0, 20], [0, 20])],
                },
            ])(
                'should create a report for interpolation with both incorrect sides',
                ({ interpolation, location, locs }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: locs[0] });
                    expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: locs[1] });
                },
            );

            it.each([
                {
                    interpolation: '{{ interpolation }}',
                    location: mockLocation([0, 0], [0, 19]),
                },
                {
                    interpolation: '<div>{{ interpolation }}</div>',
                    location: mockLocation([0, 0], [0, 30]),
                },
            ])(
                'should not create a report for interpolation with both correct sides',
                ({ interpolation, location }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(0);
                },
            );

            it.each([
                { interpolation: '{{interpolation }}', location: mockLocation([0, 0], [0, 18]), loc: mockLocation([0, 2], [0, 2]) },
                { interpolation: '{{ interpolation}}', location: mockLocation([0, 0], [0, 18]), loc: mockLocation([0, 16], [0, 16]) },
                {
                    interpolation: '<div>{{interpolation }}</div>',
                    location: mockLocation([0, 0], [0, 29]),
                    loc: mockLocation([0, 7], [0, 7]),
                },
                {
                    interpolation: '<div>{{ interpolation}}</div>',
                    location: mockLocation([0, 0], [0, 29]),
                    loc: mockLocation([0, 21], [0, 21]),
                },
            ])(
                'should create a report for interpolation with one incorrect side',
                ({ interpolation, location, loc }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({ loc, fix, messageId });
                },
            );

            it.each([
                {
                    interpolation: '{{interpolation +\ninterpolation2}}',
                    location: mockLocation([0, 0], [1, 16]),
                    locs: [mockLocation([0, 2], [0, 2]), mockLocation([1, 14], [1, 14])],
                },
                {
                    interpolation: '<div>{{interpolation +\ninterpolation2}}</div>',
                    location: mockLocation([0, 0], [1, 22]),
                    locs: [mockLocation([0, 7], [0, 7]), mockLocation([1, 14], [1, 14])],
                },
            ])(
                'should create a report for interpolation with both incorrect sides and \\n inside',
                ({ interpolation, location, locs }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: locs[0] });
                    expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: locs[1] });
                },
            );

            describe('allowNewlines = true', () => {
                beforeEach(() => {
                    context = {
                        report: jest.fn(),
                        options: [undefined, { allowNewlines: true }],
                        getFilename: jest.fn(() => 'template.html'),
                    } as unknown as TSESLint.RuleContext<string, []>;
                    listener = ruleModule.create(context) as ListenerType;
                });

                it.each([
                    {
                        interpolation: '{{\ninterpolation\n}}',
                        location: mockLocation([0, 0], [2, 2]),
                    },
                    {
                        interpolation: '<div>{{\ninterpolation\n}}</div>',
                        location: mockLocation([0, 0], [2, 8]),
                    },
                ])(
                    'should not create a report for interpolation with both sides whitespaces by \\n',
                    ({ interpolation, location }) => {
                        const boundText = mockBoundText(interpolation, 'Interpolation', location);
                        const spy = jest.spyOn(context, 'report');
                        listener.BoundText(boundText);

                        expect(spy).toHaveBeenCalledTimes(0);
                    },
                );
            });

            describe('allowNewlines = false', () => {
                beforeEach(() => {
                    context = {
                        report: jest.fn(),
                        options: [undefined, { allowNewlines: false }],
                        getFilename: jest.fn(() => 'template.html'),
                    } as unknown as TSESLint.RuleContext<string, []>;
                    listener = ruleModule.create(context) as ListenerType;
                });

                it.each([
                    {
                        interpolation: '{{\ninterpolation\n}}',
                        location: mockLocation([0, 0], [2, 2]),
                        locs: [mockLocation([0, 2], [0, 2]), mockLocation([2, 0], [2, 0])],
                    },
                    {
                        interpolation: '<div>{{\ninterpolation\n}}</div>',
                        location: mockLocation([0, 0], [2, 8]),
                        locs: [mockLocation([0, 7], [0, 7]), mockLocation([2, 0], [2, 0])],
                    },
                ])(
                    'should create a report for interpolation with both sides whitespaces by \\n',
                    ({ interpolation, location, locs }) => {
                        const boundText = mockBoundText(interpolation, 'Interpolation', location);
                        const spy = jest.spyOn(context, 'report');
                        listener.BoundText(boundText);

                        expect(spy).toHaveBeenCalledTimes(2);
                        expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: locs[0] });
                        expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: locs[1] });
                    },
                );
            });
        });

        describe('whitespace = never', () => {
            const fix = expect.anything();
            const messageId = 'whitespaceExtra';

            beforeEach(() => {
                context = {
                    report: jest.fn(),
                    options: ['never'],
                    getFilename: jest.fn(() => 'template.html'),
                } as unknown as TSESLint.RuleContext<string, []>;
                listener = ruleModule.create(context) as ListenerType;
            });

            it.each([
                {
                    interpolation: '{{ interpolation }}',
                    location: mockLocation([0, 0], [0, 19]),
                    locs: [mockLocation([0, 2], [0, 3]), mockLocation([0, 16], [0, 17])],
                },
                {
                    interpolation: '<div>{{ interpolation }}</div>',
                    location: mockLocation([0, 0], [0, 30]),
                    locs: [mockLocation([0, 7], [0, 8]), mockLocation([0, 21], [0, 22])],
                },
            ])(
                'should create a report for interpolation with both incorrect sides',
                ({ interpolation, location, locs }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: locs[0] });
                    expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: locs[1] });
                }
            );

            it.each([
                {
                    interpolation: '{{interpolation}}',
                    location: mockLocation([0, 0], [0, 17]),
                },
                {
                    interpolation: '<div>{{interpolation}}</div>',
                    location: mockLocation([0, 0], [0, 28]),
                },
            ])(
                'should not create a report for interpolation with both correct sides',
                ({ interpolation, location }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(0);
                },
            );

            it.each([
                { interpolation: '{{interpolation }}', location: mockLocation([0, 0], [0, 18]), loc: mockLocation([0, 15], [0, 16]) },
                { interpolation: '{{ interpolation}}', location: mockLocation([0, 0], [0, 18]), loc: mockLocation([0, 2], [0, 3]) },
                {
                    interpolation: '<div>{{interpolation }}</div>',
                    location: mockLocation([0, 0], [0, 29]),
                    loc: mockLocation([0, 20], [0, 21]),
                },
                {
                    interpolation: '<div>{{ interpolation}}</div>',
                    location: mockLocation([0, 0], [0, 29]),
                    loc: mockLocation([0, 7], [0, 8]),
                },
            ])(
                'should create a report for interpolation with one incorrect side',
                ({ interpolation, location, loc }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({ loc, fix, messageId });
                },
            );

            it.each([
                {
                    interpolation: '{{ interpolation +\ninterpolation2 }}',
                    location: mockLocation([0, 0], [1, 17]),
                    locs: [mockLocation([0, 2], [0, 3]), mockLocation([1, 14], [1, 15])],
                },
                {
                    interpolation: '<div>{{ interpolation +\ninterpolation2 }}</div>',
                    location: mockLocation([0, 0], [1, 23]),
                    locs: [mockLocation([0, 7], [0, 8]), mockLocation([1, 14], [1, 15])],
                },
            ])(
                'should create a report for interpolation with both incorrect sides and \\n inside',
                ({ interpolation, location, locs }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(2);
                    expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: locs[0] });
                    expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: locs[1] });
                },
            );

            describe('allowNewlines = true', () => {
                beforeEach(() => {
                    context = {
                        report: jest.fn(),
                        options: ['never', { allowNewlines: true }],
                        getFilename: jest.fn(() => 'template.html'),
                    } as unknown as TSESLint.RuleContext<string, []>;
                    listener = ruleModule.create(context) as ListenerType;
                });

                it.each([
                    {
                        interpolation: '{{\ninterpolation\n}}',
                        location: mockLocation([0, 0], [2, 2]),
                        locs: [mockLocation([0, 2], [0, 3]), mockLocation([2, 0], [2, 0])],
                    },
                    {
                        interpolation: '<div>{{\ninterpolation\n}}</div>',
                        location: mockLocation([0, 0], [2, 8]),
                        locs: [mockLocation([0, 7], [0, 8]), mockLocation([2, 0], [2, 0])],
                    },
                ])(
                    'should create a report for interpolation with both sides whitespaces by \\n',
                    ({ interpolation, location, locs }) => {
                        const boundText = mockBoundText(interpolation, 'Interpolation', location);
                        const spy = jest.spyOn(context, 'report');
                        listener.BoundText(boundText);

                        expect(spy).toHaveBeenCalledTimes(2);
                        expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: locs[0] });
                        expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: locs[1] });
                    },
                );
            });

            describe('allowNewlines = false', () => {
                beforeEach(() => {
                    context = {
                        report: jest.fn(),
                        options: ['never', { allowNewlines: false }],
                        getFilename: jest.fn(() => 'template.html'),
                    } as unknown as TSESLint.RuleContext<string, []>;
                    listener = ruleModule.create(context) as ListenerType;
                });

                it.each([
                    {
                        interpolation: '{{\ninterpolation\n}}',
                        location: mockLocation([0, 0], [2, 2]),
                        locs: [mockLocation([0, 2], [0, 3]), mockLocation([2, 0], [2, 0])],
                    },
                    {
                        interpolation: '<div>{{\ninterpolation\n}}</div>',
                        location: mockLocation([0, 0], [2, 8]),
                        locs: [mockLocation([0, 7], [0, 8]), mockLocation([2, 0], [2, 0])],
                    },
                ])(
                    'should create a report for interpolation with both sides whitespaces by \\n',
                    ({ interpolation, location, locs }) => {
                        const boundText = mockBoundText(interpolation, 'Interpolation', location);
                        const spy = jest.spyOn(context, 'report');
                        listener.BoundText(boundText);

                        expect(spy).toHaveBeenCalledTimes(2);
                        expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: locs[0] });
                        expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: locs[1] });
                    },
                );
            });
        });
    });
});

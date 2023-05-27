import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { ruleName, ruleModule } from '@package/src/rules/pipe.rule';
import type { BoundAttribute } from '@package/src/models/pipe.model';
import type { BoundText } from '@package/src/models/interpolation.model';

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

const mockValueSpan = (start: [number, number, number], end: [number, number]): BoundAttribute['valueSpan'] => ({
    start: {
        line: start[0],
        col: start[1],
        offset: start[2],
    },
    end: {
        line: end[0],
        col: start[1],
    },
});

const mockBoundAttribute = (
    source: string,
    start: [number, number, number],
    end: [number, number],
): BoundAttribute & TSESTree.BaseNode => ({
    value: { source } as BoundAttribute['value'],
    valueSpan: mockValueSpan(start, end),
} as BoundAttribute & TSESTree.BaseNode);

type ListenerType = TSESLint.RuleListener & {
    BoundText: TSESLint.RuleFunction<BoundText & TSESTree.BaseNode>;
    BoundAttribute: TSESLint.RuleFunction<BoundAttribute & TSESTree.BaseNode>;
};

describe('Pipe Rule', () => {
    let listener: ListenerType;
    let context: TSESLint.RuleContext<string, []>;

    beforeEach(() => {
        context = {
            report: jest.fn(),
            getFilename: jest.fn(() => 'template.html'),
        } as unknown as TSESLint.RuleContext<string, []>;
    });

    it('should have correct name', () => {
        expect(ruleName).toBe('pipe');
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
                    interpolation: '{{something|pipe}}',
                    location: mockLocation([0, 0], [0, 18]),
                    locs: [mockLocation([0, 11], [0, 11]), mockLocation([0, 12], [0, 12])],
                },
                {
                    interpolation: '<div>{{something|pipe}}</div>',
                    location: mockLocation([0, 0], [0, 28]),
                    locs: [mockLocation([0, 16], [0, 16]), mockLocation([0, 17], [0, 17])],
                },
            ])(
                'should create a report for pipe inside interpolation with both incorrect sides',
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
                    interpolation: '{{something | pipe}}',
                    location: mockLocation([0, 0], [0, 19]),
                },
                {
                    interpolation: '<div>{{something | pipe}}</div>',
                    location: mockLocation([0, 0], [0, 30]),
                },
            ])(
                'should not create a report for pipe inside interpolation with both correct sides',
                ({ interpolation, location }) => {
                    const boundText = mockBoundText(interpolation, 'Interpolation', location);
                    const spy = jest.spyOn(context, 'report');
                    listener.BoundText(boundText);

                    expect(spy).toHaveBeenCalledTimes(0);
                },
            );

            it.each([
                { interpolation: '{{something| pipe}}', location: mockLocation([0, 0], [0, 18]), loc: mockLocation([0, 11], [0, 11]) },
                { interpolation: '{{something |pipe}}', location: mockLocation([0, 0], [0, 18]), loc: mockLocation([0, 13], [0, 13]) },
                {
                    interpolation: '<div>{{something| pipe}}</div>',
                    location: mockLocation([0, 0], [0, 29]),
                    loc: mockLocation([0, 16], [0, 16]),
                },
                {
                    interpolation: '<div>{{something |pipe}}</div>',
                    location: mockLocation([0, 0], [0, 29]),
                    loc: mockLocation([0, 18], [0, 18]),
                },
            ])(
                'should create a report for pipe inside interpolation with one incorrect side',
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
                    interpolation: '{{\nsomething|pipe\n}}',
                    location: mockLocation([0, 0], [2, 2]),
                    locs: [mockLocation([1, 9], [1, 9]), mockLocation([1, 10], [1, 10])],
                },
                {
                    interpolation: '<div>{{\nsomething|pipe\n}}</div>',
                    location: mockLocation([0, 0], [2, 8]),
                    locs: [mockLocation([1, 9], [1, 9]), mockLocation([1, 10], [1, 10])],
                },
            ])(
                'should create a report for pipe inside interpolation with both incorrect sides and \\n inside',
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
                    interpolation: '{{something | pipe}}',
                    location: mockLocation([0, 0], [0, 19]),
                    locs: [mockLocation([0, 11], [0, 12]), mockLocation([0, 13], [0, 14])],
                },
                {
                    interpolation: '<div>{{something | pipe}}</div>',
                    location: mockLocation([0, 0], [0, 30]),
                    locs: [mockLocation([0, 16], [0, 17]), mockLocation([0, 18], [0, 19])],
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
                    interpolation: '{{something|pipe}}',
                    location: mockLocation([0, 0], [0, 17]),
                },
                {
                    interpolation: '<div>{{something|pipe}}</div>',
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
                { interpolation: '{{something| pipe}}', location: mockLocation([0, 0], [0, 18]), loc: mockLocation([0, 12], [0, 13]) },
                { interpolation: '{{something |pipe}}', location: mockLocation([0, 0], [0, 18]), loc: mockLocation([0, 11], [0, 12]) },
                {
                    interpolation: '<div>{{something| pipe}}</div>',
                    location: mockLocation([0, 0], [0, 29]),
                    loc: mockLocation([0, 17], [0, 18]),
                },
                {
                    interpolation: '<div>{{something |pipe}}</div>',
                    location: mockLocation([0, 0], [0, 29]),
                    loc: mockLocation([0, 16], [0, 17]),
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
                    interpolation: '{{\nsomething | pipe\n}}',
                    location: mockLocation([0, 0], [2, 2]),
                    locs: [mockLocation([1, 9], [1, 10]), mockLocation([1, 11], [1, 12])],
                },
                {
                    interpolation: '<div>{{\nsomething | pipe\n}}</div>',
                    location: mockLocation([0, 0], [1, 23]),
                    locs: [mockLocation([1, 9], [1, 10]), mockLocation([1, 11], [1, 12])],
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
        });
    });

    describe('BoundAttribute Listener', () => {
        beforeEach(() => {
            listener = ruleModule.create(context) as ListenerType;
        });

        it('should exist', () => {
            expect(listener).toHaveProperty('BoundAttribute');
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

            it('should create a report for pipe inside interpolation with both incorrect sides', () => {
                const boundAttribute = mockBoundAttribute(
                    '<div [attr]="something|pipe"></div>',
                    [-1, 0, 0],
                    [0, 34],
                );
                const spy = jest.spyOn(context, 'report');
                listener.BoundAttribute(boundAttribute);

                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: mockLocation([0, 22], [0, 22]) });
                expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: mockLocation([0, 23], [0, 23]) });
            });

            it('should not create a report for pipe inside interpolation with both correct sides', () => {
                const boundAttribute = mockBoundAttribute(
                    '<div [attr]="something | pipe"></div>',
                    [-1, 0, 0],
                    [0, 34],
                );
                const spy = jest.spyOn(context, 'report');
                listener.BoundAttribute(boundAttribute);

                expect(spy).toHaveBeenCalledTimes(0);
            });

            it('should not create a report for attribute without value', () => {
                const boundAttribute = {
                    value: { source: '<div [attr]></div>' } as BoundAttribute['value'],
                } as BoundAttribute & TSESTree.BaseNode;
                const spy = jest.spyOn(context, 'report');
                listener.BoundAttribute(boundAttribute);

                expect(spy).toHaveBeenCalledTimes(0);
            });

            it.each([
                { html: '<div [attr]="something| pipe"></div>', loc: mockLocation([0, 22], [0, 22]) },
                { html: '<div [attr]="something |pipe"></div>', loc: mockLocation([0, 24], [0, 24]) },
            ])('should create a report for pipe inside interpolation with one incorrect side', ({ html, loc }) => {
                const boundAttribute = mockBoundAttribute(html, [-1, 0, 0], [0, 35]);
                const spy = jest.spyOn(context, 'report');
                listener.BoundAttribute(boundAttribute);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith({ loc, fix, messageId });
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

            it('should create a report for pipe inside interpolation with both incorrect sides', () => {
                const boundAttribute = mockBoundAttribute(
                    '<div [attr]="something | pipe"></div>',
                    [-1, 0, 0],
                    [0, 34],
                );
                const spy = jest.spyOn(context, 'report');
                listener.BoundAttribute(boundAttribute);

                expect(spy).toHaveBeenCalledTimes(2);
                expect(spy).toHaveBeenNthCalledWith(1, { fix, messageId, loc: mockLocation([0, 22], [0, 23]) });
                expect(spy).toHaveBeenNthCalledWith(2, { fix, messageId, loc: mockLocation([0, 24], [0, 25]) });
            });

            it('should not create a report for pipe inside interpolation with both correct sides', () => {
                const boundAttribute = mockBoundAttribute(
                    '<div [attr]="something|pipe"></div>',
                    [-1, 0, 0],
                    [0, 34],
                );
                const spy = jest.spyOn(context, 'report');
                listener.BoundAttribute(boundAttribute);

                expect(spy).toHaveBeenCalledTimes(0);
            });

            it.each([
                { html: '<div [attr]="something| pipe"></div>', loc: mockLocation([0, 23], [0, 24]) },
                { html: '<div [attr]="something |pipe"></div>', loc: mockLocation([0, 22], [0, 23]) },
            ])('should create a report for pipe inside interpolation with one incorrect side', ({ html, loc }) => {
                const boundAttribute = mockBoundAttribute(html, [-1, 0, 0], [0, 35]);
                const spy = jest.spyOn(context, 'report');
                listener.BoundAttribute(boundAttribute);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith({ loc, fix, messageId });
            });
        });
    });
});

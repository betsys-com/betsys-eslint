import { ArgumentParser } from '@package/src/parsers/argument.parser';
import { ArgumentValidationError } from '@package/src/errors/argument-validation.error';

jest.mock('path', () => {
    const actualPath = jest.requireActual('path');

    return {
        ...actualPath,
        resolve: (...args: string[]) => {
            if (args[0]?.startsWith('/')) {
                return actualPath.join(...args);
            }

            return actualPath.join('/resolved-absolute', ...args);
        },
    };
});

describe('Argument Parser', () => {
    let parser: ArgumentParser;

    beforeEach(() => {
        parser = new ArgumentParser();
        process.argv = ['', ''];
    });

    it('should create', () => {
        expect(parser).toBeTruthy();
    });

    describe('argument: type', () => {
        it.each(['config', 'plugin'])('should be valid with "%s"', (packageType: string) => {
            process.argv.push(packageType, 'placeholder');
            expect(parser.parse()).toBeTruthy();
        });

        it.each(['', 'different'])('should be invalid with "%s"', (packageType: string) => {
            process.argv.push(packageType, 'placeholder');
            try {
                parser.parse();
            } catch (e) {
                expect(e).toBeInstanceOf(ArgumentValidationError);
                expect((e as ArgumentValidationError).toString()).toContain('argument type');
            }
        });
    });

    describe('argument: name', () => {
        it.each(['name', 'long-name', '@namespace/long-name'])('should be valid with "%s"', (packageName: string) => {
            process.argv.push('config', packageName);
            expect(parser.parse()).toBeTruthy();
        });

        it('should be invalid with empty string', () => {
            process.argv.push('config', '');
            try {
                parser.parse();
            } catch (e) {
                expect(e).toBeInstanceOf(ArgumentValidationError);
                expect((e as ArgumentValidationError).toString()).toContain('argument name');
            }
        });
    });

    describe('argument: path', () => {
        it.each(['.', 'hello/path', './hello/path', '/hello/path'])('should be valid with "%s"', (path: string) => {
            process.argv.push('config', 'placeholder', path);
            expect(parser.parse()).toBeTruthy();
        });

        it('should be valid when not provided', () => {
            process.argv.push('config', 'placeholder');
            parser.parse();
            expect(parser.parse()).toBeTruthy();
        });

        it.each([
            { path: '.', expectedPath: '/resolved-absolute/' },
            { path: '/hello/path', expectedPath: '/hello/path/' },
            { path: '', expectedPath: '/resolved-absolute/cwd/' },
            { path: 'hello/path', expectedPath: '/resolved-absolute/hello/path/' },
            { path: './hello/path', expectedPath: '/resolved-absolute/hello/path/' },
        ])('should convert relative path "$path" to absolute path "$expectedPath"', ({ path, expectedPath }) => {
            process.argv.push('config', 'placeholder');
            if (path) {
                process.argv.push(path);
            }

            jest.spyOn(process, 'cwd').mockReturnValue('cwd');
            expect(parser.parse().path).toBe(expectedPath);
        });
    });
});

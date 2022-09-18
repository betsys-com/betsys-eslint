import type { ExecException } from 'child_process';
import { SchemaInstaller } from '@package/installers/schema.installer';

jest.mock('child_process', () => {
    class CustomExecException implements ExecException {
        cause = new Error('Test error');
        cmd = 'test cmd';
        name = 'CustomExecException';
        stack = 'test stack';
        killed = false;

        constructor(public code: number | undefined, public message: string) {}
    }

    return {
        exec: jest.fn()
            .mockImplementationOnce((cmd: string, cb: (err: ExecException, _: string, stderr: string) => void) => {
                const error = new CustomExecException(0, 'All good');
                cb(error, '', error.message);
            })
            .mockImplementationOnce((cmd: string, cb: (err: ExecException, _: string, stderr: string) => void) => {
                const error = new CustomExecException(1, 'Fail 1');
                cb(error, '', error.message);
            }),
    };
});

describe('Schema Installer', () => {
    describe('install', () => {
        it('should run schema for the package', (done) => {
            SchemaInstaller.install('@namespace/package').then((result) => {
                const spy = jest.requireMock('child_process').exec;
                expect(result).toBe(undefined);
                expect(spy).toHaveBeenNthCalledWith(
                    1,
                    'npx @angular-devkit/schematics-cli @namespace/package:install',
                    expect.anything(),
                );
                done();
            });
        });

        it('should fail the schema installation on error', (done) => {
            SchemaInstaller.install('@namespace/package').catch((result) => {
                expect(result).toBe('Fail 1');
                done();
            });
        });
    });
});

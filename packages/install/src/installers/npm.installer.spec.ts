import type { ExecException } from 'child_process';
import { NpmInstaller } from '@package/src/installers/npm.installer';

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
            .mockImplementationOnce((
                cmd: string,
                opt: { cmd: string },
                cb: (err: ExecException, _: string, stderr: string) => void,
            ) => {
                const error = new CustomExecException(0, 'All good');
                cb(error, '', error.message);
            })
            .mockImplementationOnce((
                cmd: string,
                opt: { cmd: string },
                cb: (err: ExecException, _: string, stderr: string) => void,
            ) => {
                const error = new CustomExecException(1, 'Fail 1');
                cb(error, '', error.message);
            }),
    };
});

describe('NPM Installer', () => {
    describe('installPackage', () => {
        it('should install package without it\'s dependencies', (done) => {
            NpmInstaller.installPackage('@namespace/package', '/abs/path').then((result) => {
                const spy = jest.requireMock('child_process').exec;
                expect(result).toBe(undefined);
                expect(spy).toHaveBeenNthCalledWith(
                    1,
                    'npm install --save-dev @namespace/package',
                    expect.anything(),
                    expect.anything(),
                );
                done();
            });
        });

        it('should fail the package installation on error', (done) => {
            NpmInstaller.installPackage('@namespace/package', '/abs/path').catch((result) => {
                expect(result).toBe('Fail 1');
                done();
            });
        });
    });
});

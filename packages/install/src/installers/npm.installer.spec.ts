import type { ExecException } from 'child_process';
import { NpmInstaller } from '@package/installers/npm.installer';

jest.mock('child_process', () => ({
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
    })
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
      const error = new CustomExecException(2, 'Fail 2');
      cb(error, '', error.message);
    }),
}));

class CustomExecException implements ExecException {
  cause = new Error('Test error');
  cmd = 'test cmd';
  name = 'CustomExecException';
  stack = 'test stack';
  killed = false;

  constructor(public code: number | undefined, public message: string) {}
}

describe('NPM Installer', () => {
  describe('installPackage', () => {
    it('should install package without it\'s dependencies', (done) => {
      NpmInstaller.installPackage('@namespace/package', '/abs/path').then(result => {
        const spy = jest.requireMock('child_process').exec;
        expect(result).toBe(undefined);
        expect(spy).toHaveBeenNthCalledWith(
          1,
          'npm install --save-dev @namespace/package --legacy-peer-deps',
          expect.anything(),
          expect.anything(),
        );
        done();
      });
    });

    it('should fail the package installation on error', (done) => {
      NpmInstaller.installPackage('@namespace/package', '/abs/path').catch(result => {
        expect(result).toBe('Fail 1');
        done();
      });
    });
  });

  describe('installPackages', () => {
    it('should install multiple packages', (done) => {
      NpmInstaller.installPackages(['@namespace/package@">= 12.0.0"'], '/abs/path').then(result => {
        const spy = jest.requireMock('child_process').exec;
        expect(result).toBe(undefined);
        expect(spy).toHaveBeenNthCalledWith(
          3,
          'npm install --save-dev @namespace/package@">= 12.0.0"',
          expect.anything(),
          expect.anything(),
        );
        done();
      });
    });

    it('should fail the package installation on error', (done) => {
      NpmInstaller.installPackages(['@namespace/package@">= 12.0.0"'], '/abs/path').catch(result => {
        expect(result).toBe('Fail 2');
        done();
      });
    });
  });
});

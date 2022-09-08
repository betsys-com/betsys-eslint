import { exec } from 'child_process';

export class NpmInstaller {
  static installPackage(packageName: string, cwd: string, saveAs: 'devDependencies' | 'dependencies' = 'dependencies'): Promise<void> {
    return new Promise(async (res, rej) => {
      exec(
        `npm install --${saveAs} ${packageName} --legacy-peer-deps`,
        { cwd },
        (err, _, stderr) => {
          const errorCode = err?.code ?? 0;
          if (errorCode > 0) {
            return rej(stderr);
          }

          res();
      });
    });
  }

  static installPackages(packages: string[], cwd: string, saveAs: 'devDependencies' | 'dependencies' = 'devDependencies'): Promise<void> {
    return new Promise(async (res, rej) => {
      exec(`npm install --${saveAs} ${packages.join(' ')}`, (err, _, stderr) => {
        const errorCode = err?.code ?? 0;
        if (errorCode > 0) {
          return rej(stderr);
        }

        res();
      });
    });
  }
}

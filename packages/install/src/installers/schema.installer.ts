import { exec } from 'child_process';

export class SchemaInstaller {
  static async install(packageName: string): Promise<void> {
    return new Promise(async (res, rej) => {
      exec(
        `npx @angular-devkit/schematics-cli ${packageName}:install`,
        (err, _, stderr) => {
          const errorCode = err?.code ?? 0;
          if (errorCode > 0) {
            return rej(stderr);
          }

          res();
        });
    });
  }
}

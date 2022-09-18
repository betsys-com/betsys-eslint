import { exec } from 'child_process';

export class NpmInstaller {
    static installPackage(packageName: string, cwd: string, saveAs: 'devDependency' | 'dependency' = 'devDependency'): Promise<void> {
        const saveAsArg = `--save${saveAs === 'dependency' ? '' : '-dev'}`;

        return new Promise((res, rej) => {
            exec(`npm install ${saveAsArg} ${packageName}`, { cwd }, (err, _, stderr) => {
                const errorCode = err?.code ?? 0;
                if (errorCode > 0) {
                    return rej(stderr);
                }

                res();
            });
        });
    }
}

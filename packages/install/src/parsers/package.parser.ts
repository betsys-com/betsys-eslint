import { existsSync, readFileSync } from 'fs';
import { Parser } from '@package/install/models/parser.model';
import { Package, PackageType } from '@package/install/models/package.model';
import { InstallationError } from '@package/install/errors/installation.error';

export class PackageParser implements Parser<Promise<string[]>, [string]> {
  async parse(pathToPackageJson: string | null): Promise<string[]> {
    if (!pathToPackageJson || !existsSync(pathToPackageJson)) {
      throw new InstallationError('Unable to locate package.json file.');
    }
    const packageJsonContents = readFileSync(pathToPackageJson).toString('utf-8');
    const packageJson = new Package(packageJsonContents);

    return Object.entries(packageJson.peerDependencies).map(([packageName, version]) => {
      return `${packageName}@"${version.replace(/\s/g, '')}"`;
    });
  }

  static createName(packageType: PackageType, name: string): string {
    return `eslint-${packageType}-${name}`;
  }

  static stripVersion(packageWithVersion: string): string {
    const matches = packageWithVersion.matchAll(/(.+)@(.*)/g);
    return Array.from(matches)?.[0]?.[1] ?? packageWithVersion;
  }
}
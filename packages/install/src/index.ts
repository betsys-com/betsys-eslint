import { resolve } from 'path';
import { PackageType } from '@package/install/models/package.model';
import { PackageParser } from '@package/install/parsers/package.parser';
import { NpmInstaller } from '@package/install/installers/npm.installer';
import { InstallationError } from '@package/install/errors/installation.error';

export async function installPackageAndItsPeerDeps(type: PackageType, name: string): Promise<void> {
  const packageName = PackageParser.createName(type, name);

  try {
    await NpmInstaller.installPackage(packageName);
    const packageNameWithoutVersion = PackageParser.stripVersion(packageName);
    const packageRoot = resolve(__dirname, 'node_modules', ...packageNameWithoutVersion.split('/'));
    const peerDependencies = await (new PackageParser()).parse(resolve(packageRoot, 'package.json'));
    await NpmInstaller.installPackages(peerDependencies);
  } catch (e) {
    throw new InstallationError(e);
  }
}

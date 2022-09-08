import chalk from 'chalk';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import resolvePath from 'resolve-package-path';
import { PackageParser } from '@package/install/parsers/package.parser';
import { NpmInstaller } from '@package/install/installers/npm.installer';
import { ArgumentParser } from '@package/install/parsers/argument.parser';

(async () => {
  const args = (new ArgumentParser()).parse();
  const packageName = PackageParser.createName(args.type, args.name);
  const __dirname = dirname(fileURLToPath(import.meta.url));

  try {
    console.info(chalk.blueBright(`Installing package ${packageName}`));
    await NpmInstaller.installPackage(packageName);
    const packageNameWithoutVersion = PackageParser.stripVersion(packageName);
    const pathToPackageJson = resolvePath(packageNameWithoutVersion, __dirname);
    const peerDependencies = await (new PackageParser()).parse(pathToPackageJson);
    console.info(chalk.blue('Installing peer dependencies:'));
    peerDependencies.map(dep => console.info(chalk.blue(`  - ${dep}`)));
    await NpmInstaller.installPackages(peerDependencies);
    console.info(chalk.bold.green('All packages have been installed.'));
  } catch (e) {
    console.error(chalk.bold.red(`${e}`));
  }
})();

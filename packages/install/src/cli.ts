import chalk from 'chalk';
import resolvePath from 'resolve-package-path';
import { PackageParser } from '@package/install/parsers/package.parser';
import { NpmInstaller } from '@package/install/installers/npm.installer';
import { ArgumentParser } from '@package/install/parsers/argument.parser';

(async () => {
  const args = (new ArgumentParser()).parse();
  const packageName = PackageParser.createName(args.type, args.name);

  try {
    console.info(chalk.blueBright(`Installing package ${packageName}`));
    await NpmInstaller.installPackage(packageName, args.path);
    const packageNameWithoutVersion = PackageParser.stripVersion(packageName);
    const pathToPackageJson = resolvePath(packageNameWithoutVersion, args.path);
    const peerDependencies = await (new PackageParser()).parse(pathToPackageJson);
    console.info(chalk.blue('Installing peer dependencies:'));
    peerDependencies.map(dep => console.info(chalk.blue(`  - ${dep}`)));
    await NpmInstaller.installPackages(peerDependencies, args.path);
    console.info(chalk.bold.green('All packages have been installed.'));
  } catch (e) {
    console.error(chalk.bold.red(`${e}`));
  }
})();

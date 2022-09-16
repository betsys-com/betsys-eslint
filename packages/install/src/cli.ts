import chalk from 'chalk';
import { NpmInstaller } from '@package/installers/npm.installer';
import { ArgumentParser } from '@package/parsers/argument.parser';
import { resolvePackageName } from '@package/utils/package.utils';
import { SchemaInstaller } from '@package/installers/schema.installer';

(async () => {
  try {
    const args = (new ArgumentParser()).parse();
    const packageName = resolvePackageName(args.type, args.name);

    console.info(chalk.blueBright(`Installing package ${packageName}`));
    await NpmInstaller.installPackage(packageName, args.path);

    console.info(chalk.blue('Running installation schema'));
    await SchemaInstaller.install(packageName);

    console.info(chalk.bold.green(`Package ${packageName} have been installed.`));
  } catch (e) {
    console.error(chalk.bold.red(`${e}`));
  }
})();

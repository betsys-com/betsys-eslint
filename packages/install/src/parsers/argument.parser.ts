import { argv } from 'process';
import { Parser } from '@package/install/models/parser.model';
import { Arguments } from '@package/install/models/argument.model';
import { PackageType } from '@package/install/models/package.model';
import { ArgumentValidationError } from '@package/install/errors/argument-validation.error';

export class ArgumentParser implements Parser<Arguments> {
  parse(): Arguments {
    const args = argv.slice(2);
    const type = args[0];
    if (!this.isCorrectPackageType(type)) {
      throw new ArgumentValidationError('type', type);
    }

    const name = args[1];
    if (!name) {
      throw new ArgumentValidationError('name', type);
    }

    return { type, name };
  }

  private isCorrectPackageType(packageType: string): packageType is PackageType {
    return packageType === 'config' || packageType === 'plugin';
  }
}

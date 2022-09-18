import { resolve } from 'path';
import * as process from 'process';
import { Parser } from '@package/models/parser.model';
import { Arguments } from '@package/models/argument.model';
import { PackageType } from '@package/models/package.model';
import { ArgumentValidationError } from '@package/errors/argument-validation.error';

export class ArgumentParser implements Parser<Arguments> {
    parse(): Arguments {
        const args = process.argv.slice(2);
        const type = args[0];
        if (!this.isCorrectPackageType(type)) {
            throw new ArgumentValidationError('type', type);
        }

        const name = args[1];
        if (!name) {
            throw new ArgumentValidationError('name', name);
        }

        const cwd = args[2] ?? process.cwd();
        const path = resolve(cwd.endsWith('/') ? cwd : (`${cwd}/`));

        return { type, name, path };
    }

    private isCorrectPackageType(packageType: string): packageType is PackageType {
        return packageType === 'config' || packageType === 'plugin';
    }
}

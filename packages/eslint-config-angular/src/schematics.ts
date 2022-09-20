import { name } from '@package/package.json';
import type { Rule, Tree } from '@angular-devkit/schematics';
import { isArray, isObject, removeFromArray, createOrPushToArray } from '@package/src/utils/schematics.utils';

export function install(): Rule {
    return (tree: Tree) => {
        const fileName = '.eslintrc.json';
        const packageConfigName = name.replace('eslint-config-', '');

        if (!tree.exists(fileName)) {
            console.error(`Unable to locate ${fileName} file. Schematics will not be run.`);

            return tree;
        }

        const json = tree.readJson(fileName);
        if (!isObject(json) || isArray(json)) {
            console.error(`ESLint configuration has not been found in ${fileName}. Schematics will not be run.`);

            return tree;
        }

        // By default, we will edit the root configurations.
        let fieldsToEdit = json;

        // This tries to find override settings for "*.ts" files. Will be undefined if they are not present.
        const overrides = json.overrides
            && isArray(json.overrides)
            && json.overrides.find((override) => isObject(override) && isArray(override.files) && override.files.includes('*.ts'));

        // If we see that there are overrides for *.ts files, we will edit those.
        if (overrides && isObject(overrides)) {
            fieldsToEdit = overrides;
        }

        removeFromArray(fieldsToEdit, 'extends', '@betsys-eslint/typescript');
        createOrPushToArray(fieldsToEdit, 'extends', packageConfigName);
        tree.overwrite(fileName, JSON.stringify(json, null, 4));

        return tree;
    };
}

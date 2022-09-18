import { name } from '@package/package.json';
import type { Rule, Tree } from '@angular-devkit/schematics';
import { createOrPushToArray, isArray, isObject } from '@package/src/utils/schematics.utils';

// You don't have to export the function as default. You can also have more than one rule factory per file.
export function install(): Rule {
    return (tree: Tree) => {
        const fileName = '.eslintrc.json';
        const packageName = name.replace('eslint-plugin-', '');
        const pluginSettings = `plugin:${packageName}/recommended`;

        if (!tree.exists(fileName)) {
            console.error(`Unable to locate ${fileName} file. Schematics will not be run.`);

            return tree;
        }

        const json = tree.readJson(fileName);
        if (!isObject(json) || isArray(json)) {
            console.error(`ESLint configuration has not been found in ${fileName}. Schematics will not be run.`);

            return tree;
        }

        // By default, we will edit the root plugins.
        let fieldsToEdit = json;

        // This tries to find override settings for "*.html" files. Will be undefined if they are not present.
        const overrides = json.overrides
            && isArray(json.overrides)
            && json.overrides.find((override) => isObject(override) && isArray(override.files) && override.files.includes('*.html'));

        // If we see that there are overrides for *.ts files, we will edit those.
        if (overrides && isObject(overrides)) {
            fieldsToEdit = overrides;
        }

        createOrPushToArray(fieldsToEdit, 'plugins', packageName);
        createOrPushToArray(fieldsToEdit, 'extends', pluginSettings);

        tree.overwrite(fileName, JSON.stringify(json, null, 4));

        return tree;
    };
}

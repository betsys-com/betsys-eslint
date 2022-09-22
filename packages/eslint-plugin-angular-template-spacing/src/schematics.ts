import { name } from '@package/package.json';
import type { Rule, Tree } from '@angular-devkit/schematics';
import type { JsonValue } from '@package/src/models/schematics.model';
import { createOrPushToArray, isArray, isObject } from '@package/src/utils/schematics.utils';

function createOrUpdateJsonSchema(tree: Tree, packageName: string): Tree {
    const fileName = '.eslintrc.json';
    let updating = false;
    let json: JsonValue = {};

    if (tree.exists(fileName)) {
        updating = true;
        json = tree.readJson(fileName);
        if (!isObject(json)) {
            json = {};
        }
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
    createOrPushToArray(fieldsToEdit, 'extends', `plugin:${packageName}/recommended`);

    if (updating) {
        tree.overwrite(fileName, JSON.stringify(json, null, 4));
    } else {
        tree.create(fileName, JSON.stringify(json, null, 4));
    }

    return tree;
}

export function install(): Rule {
    return (tree: Tree) => createOrUpdateJsonSchema(tree, name.replace('eslint-plugin-', ''));
}

import { name, homepage } from '@package/../package.json';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { createOrPushToArray, isArray, isObject } from '@package/utils/schematics.utils';

// You don't have to export the function as default. You can also have more than one rule factory per file.
export function install(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = '.eslintrc.json';
    const packageName = name.replace('eslint-plugin-', '');
    const pluginSettings = `plugin:${packageName}/recommended`;

    if (!tree.exists(path)) {
      console.error(`Unable to locate ${path} file, config will not be updated. You can do it manually by following the instructions at ${homepage}`);
      return tree;
    }

    const json = tree.readJson(path);
    if (!isObject(json) || isArray(json)) {
      console.log(`Your ${path} file is not a valid object. This should not be happening. No changes were made.`);
      return tree;
    }

    // By default, we will edit the root plugins.
    let fieldsToEdit = json;

    // This tries to find override settings for "*.ts" files. Will be undefined if they are not present.
    const overrides =
      json['overrides'] &&
      isArray(json['overrides']) &&
      json['overrides'].find(override => isObject(override) && isArray(override['files']) && override['files'].includes('*.html'));

    // If we see that there are overrides for *.ts files, we will edit those.
    if (overrides && isObject(overrides)) {
      fieldsToEdit = overrides;
    }

    createOrPushToArray(fieldsToEdit, 'plugins', packageName);
    createOrPushToArray(fieldsToEdit, 'extends', pluginSettings);

    tree.overwrite(path, JSON.stringify(json, null, 4));

    return tree;
  };
}

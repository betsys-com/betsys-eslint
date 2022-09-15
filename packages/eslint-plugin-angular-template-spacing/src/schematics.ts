import * as chalk from 'chalk';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  isJsonArray,
  isJsonObject, JsonObject,
} from '@angular-devkit/core';
import { name, homepage } from '../package.json'

function createOrPushToArray(json: JsonObject, path: string, member: string) {
  const array = json[path];
  if (isJsonArray(array)) {
    if (!array.includes(member)) {
      array.push(member);
    }
  } else {
    json[path] = [member];
  }
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = '.eslint.json';
    const pluginSettings = `plugin:${name}/recommended`

    if (!tree.exists(path)) {
      console.log(chalk.bold.red(`Unable to locate ${path} file, config will not be updated. You can do it manually by following the instructions at ${homepage}`));
      return tree;
    }

    const json = tree.readJson(path)
    if (!isJsonObject(json) || isJsonArray(json)) {
      console.log(chalk.bold.red(`Your ${path} file is not a valid object. This should not be happening. No changes were made.`));
      return tree;
    }

    // By default, we will edit the root plugins.
    let fieldsToEdit = json;

    // This tries to find override settings for "*.ts" files. Will be undefined if they are not present.
    const overrides =
      json['overrides'] &&
      isJsonArray(json['overrides']) &&
      json['overrides'].find(override => isJsonObject(override) && isJsonArray(override['files']) && override['files'].includes('*.ts'));

    // If we see that there are overrides for *.ts files, we will edit those.
    if (overrides && isJsonObject(overrides)) {
      fieldsToEdit = overrides;
    }

    createOrPushToArray(fieldsToEdit, 'plugins', name)
    createOrPushToArray(fieldsToEdit, 'extends', pluginSettings)

    tree.overwrite(path, JSON.stringify(json, null, 4))

    return tree;
  };
}

import { isJsonArray, JsonObject } from '@angular-devkit/core';

export function createOrPushToArray(json: JsonObject, path: string, member: string): void {
  const array = json[path];
  if (isJsonArray(array)) {
    if (!array.includes(member)) {
      array.push(member);
    }
  } else {
    json[path] = [member];
  }
}

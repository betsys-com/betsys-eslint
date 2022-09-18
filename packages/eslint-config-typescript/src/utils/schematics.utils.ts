import type { JsonArray, JsonObject, JsonValue } from '@package/src/models/schematics.model';

export function isObject(value: JsonValue): value is JsonObject {
    return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: JsonValue): value is JsonArray {
    return Array.isArray(value);
}

export function createOrPushToArray(json: JsonObject, path: string, member: string): void {
    const array = json[path];
    if (isArray(array)) {
        if (!array.includes(member)) {
            array.push(member);
        }
    } else {
        // eslint-disable-next-line no-param-reassign
        json[path] = [member];
    }
}

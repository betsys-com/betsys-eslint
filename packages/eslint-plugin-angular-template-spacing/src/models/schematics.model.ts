export type JsonArray = Array<JsonValue>;

export interface JsonObject {
  [prop: string]: JsonValue;
}
export declare type JsonValue = boolean | string | number | JsonArray | JsonObject | null;

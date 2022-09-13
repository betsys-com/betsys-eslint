export interface ExtendedOptions {
  allowNewlines: boolean;
}

export enum RuleValue {
  Always = 'always',
  Never = 'never',
}

export type PipeRuleOptions = [RuleValue?];
export type InterpolationRuleOptions = [RuleValue?, ExtendedOptions?];

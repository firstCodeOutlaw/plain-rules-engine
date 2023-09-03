import { type Action, type Operator } from './enums';

export type RuleError = {
  message: string;
};
export type UnknownObject = Record<string, unknown>;

export type ApplyRulesResponse = {
  results: UnknownObject[];
  omitted?: Array<[UnknownObject, RuleError | null]>;
};

export type Effect = {
  action: Action;
  property?: string;
  value?: number;
  error?: RuleError;
};

export type Condition = [string, Operator, string | number];

export type Rule = Record<
  string,
  {
    conditions: Condition[];
    effect: Effect;
  }
>;

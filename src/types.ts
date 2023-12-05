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
  value?: boolean | number | string;
  error?: RuleError;
};

export type ValidOperand =
  | number
  | string
  | unknown[]
  | boolean
  | UnknownObject;

export type Condition = [string, Operator, ValidOperand];

export type Rule = Record<
  string,
  {
    conditions: Condition[];
    effect: Effect;
  }
>;

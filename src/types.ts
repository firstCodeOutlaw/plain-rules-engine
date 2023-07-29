import { Action, Operator } from './enums';

export type RuleError = { message: string };
export type UnknownObject = Record<string, unknown>;

export type ApplyRulesResponse = {
    results: UnknownObject[];
    omitted?: [UnknownObject, RuleError | null][];
};

export type Effect = {
    action: Action;
    property?: string;
    value?: number;
    error?: RuleError;
};

export type Condition = [string, Operator, string];

export type Rule = Record<string, {
    conditions: Condition[];
    effect: Effect;
}>;




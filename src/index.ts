"use strict"

import {
    ApplyRulesResponse,
    Condition,
    Effect,
    Rule,
    RuleError,
    UnknownObject,
} from './types';
import { Action, Operator } from './enums';

export class RuleEngine {
    private readonly rules: Rule;

    constructor(rules: Rule) {
        this.rules = rules;
    }

    /**
     * Fetches a rule from `rules.json` using the rule name. If no rule
     * matches the provided rule name, an error is thrown.
     */
    getRule(ruleName: string): { conditions: Condition[]; effect: Effect } {
        if (this.rules[ruleName]) return this.rules[ruleName];
        throw new Error(`No rule found for ${ruleName}`);
    }

    /**
     * Returns the operator that corresponds to the provided operator name.
     * It throws an error if no operator that matches the provided operator
     * name is found.
     */
    getOperator(operator: Operator): string {
        switch (operator) {
            case Operator.CONTAINS:
                return Operator.CONTAINS;
            case Operator.EQUALS:
                return '===';
            case Operator.GREATER_THAN:
                return '>';
            case Operator.GREATER_THAN_OR_EQUALS:
                return '>=';
            case Operator.LESS_THAN:
                return '<';
            case Operator.LESS_THAN_OR_EQUALS:
                return '<=';
            default:
                throw new Error(
                    `No matching operator found for ${operator}`,
                );
        }
    }

    /**
     * Check whether type of `value` is an object.
     */
    isPlainObject(value: unknown): value is UnknownObject {
        return typeof value === 'object' && !Array.isArray(value) && value !== null;
    }

    /**
     * Takes a `key` string that allows the dot notation syntax to access object
     * properties (`object.key.subKey`), and an object. It splits the key on the
     * `"."` character, and attempts to recursively access the properties of the
     * provided object.
     * TODO: revisit use of `keyof {}` here
     */
    getObjectKeyValue<T extends {}>(key: string, object: T): string | string[] | number {
        const keys: string[] = key.split(".");
        const value = keys.reduce((accumulator, currentValue: string) => {
            if (this.isPlainObject(accumulator) && accumulator[currentValue as keyof {}]) {
                return accumulator[currentValue as keyof {}];
            }

            throw new Error(`Object has no ${currentValue} key`);
        }, object);

        return <string | string[] | number><unknown>value;
    }

    /**
     * Takes a string `field`, an object `object` of type `T`, and an optional
     * `fallbackObject`. The first two characters of the `field` string is checked to
     * see if it equals `"$"`. e.g. if the string is `"$.downloadedTracks"`, it uses the
     * `getObjectKeyValue` method to check the provided track object for a `downloadedTracks`
     * key. If the key is found, the value is returned. Else, it checks the fallback
     * object for a `downloadedTracks` key. However, if the provided `field` string does
     * not start with `"$."`, that string is returned as is.
     *
     * You should provide a fallback object where one or more rules compare values
     * across different objects.
     */
    getFieldValue(field: string, object: UnknownObject, fallbackObject?: UnknownObject): string | string[] | number {
        if (field[0] === '$') {
            const value = this.getObjectKeyValue<UnknownObject>(field.substring(2), object);
            if (value) return value;

            if (!fallbackObject)
                throw new Error(
                    `Object has no ${field.substring(2)} key, and no fallback object was provided`,
                );

            return this.getObjectKeyValue<UnknownObject>(field.substring(2), fallbackObject);
        }

        return field;
    }

    /**
     * Constructs a string expression and evaluates whether the expression is truthy.
     * It uses `Function()`, a close relative to JavaScript `eval()`, to evaluate the
     * expression based on any of the operations defined under `Operation` enum.
     */
    conditionIsTruthy(left: number | string | string[], operator: Operator, right: number | string): boolean {
        const comparator = this.getOperator(operator);
        // todo: you should use getFieldValue() here

        if (comparator === Operator.CONTAINS) {
            return Function(
                `"use strict"; return ('${left}'.includes('${right}'))`,
            )();
        }

        return Function(
            `"use strict"; return ('${left}' ${comparator} '${right}')`,
        )();
    }

    /**
     * Perform some checks on `effect` and `targetObject` to confirm that an
     * arithmetic operation can be done on the target object.
     */
    effectIsReadyForArithmeticOperation(
        effect: Effect,
        targetObject: UnknownObject
    ): { property: string; value: number } {
        if (!effect?.property)
            throw new Error("RuleDefinitionError: property that receives effect is not defined in rule");
        // At this point, we cannot afford to have `effect.value` as undefined because
        // we want to perform an arithmetic action
        if (!effect?.value || !Number.isInteger(effect.value))
            throw new Error("Effect value is either undefined or not a number");

        if (!this.isPlainObject(targetObject)) throw new Error("runEffect expects an object");

        const { property } = effect;
        if (!Number.isInteger(targetObject[property]))
            throw new Error("FatalError: attempting to increment a value whose type is not number");

        return { property, value: effect.value };
    }

    runEffect(object: UnknownObject, effect: Effect): UnknownObject | Action {
        const clonedObject = structuredClone(object);

        switch (effect.action) {
            case Action.INCREMENT:
                const increment = this.effectIsReadyForArithmeticOperation(effect, clonedObject);
                clonedObject[increment.property] = (clonedObject[increment.property] as number) + increment.value;
                break;
            case Action.DECREMENT:
                const decrement = this.effectIsReadyForArithmeticOperation(effect, clonedObject);
                clonedObject[decrement.property] = (clonedObject[decrement.property] as number) - decrement.value;
                break;
            case Action.REPLACE:
                if (!effect?.property)
                    throw new Error("RuleDefinitionError: property that receives effect is not defined in rule");
                clonedObject[effect.property] = effect.value;
                break;
            case Action.OMIT:
            case Action.OMIT_WITH_SILENT_ERROR:
                return effect.action;
            default:
                throw new Error(`${effect.action} not found in effect runner`);
        }

        return clonedObject;
    }

    checkForMatchingRules(object: UnknownObject, fallback?: UnknownObject): string[] {
        const matchedRules: string[] = [];

        for (const ruleName in this.rules) {
            const { conditions } = this.getRule(ruleName);
            let numberOfRulesMatched = 0;

            for (const condition of conditions) {
                const [leftField, operator, rightField] = condition;
                const left = this.getFieldValue(leftField, object, fallback);
                const right = this.getFieldValue(rightField, object, fallback);

                if (!(typeof right === "string" || typeof right === "number"))
                    throw new Error("conditionIsTruthy: argument 'right' is not a string or number");

                if (this.conditionIsTruthy(left, operator, right)) {
                    numberOfRulesMatched++;
                } else break;
            }

            if (numberOfRulesMatched === conditions.length) {
                matchedRules.push(ruleName);
            }
        }

        return matchedRules;
    }

    applyRules(objects: UnknownObject[], fallback?: UnknownObject): ApplyRulesResponse {
        const results: UnknownObject[] = [];
        const omitted: [UnknownObject, RuleError | null][] = [];

        for (const object of objects) {
            const matchedRules: string[]
                = this.checkForMatchingRules(object, fallback);

            if (!matchedRules.length) {
                results.push(object);
                return { results };
            }

            for (const ruleName of matchedRules) {
                const { effect } = this.getRule(ruleName);
                const feedback = this.runEffect(object, effect);

                switch (feedback) {
                    // if feedback is "omit" or "omit_with_silent_error", then we should
                    // omit the current object by not pushing it to results array.
                    case Action.OMIT:
                        omitted.push([object, null]);
                        continue;
                    case Action.OMIT_WITH_SILENT_ERROR:
                        if (!effect?.error) throw new Error("Expected error on effect, but found none");
                        omitted.push([object, { message: effect.error.message }]);
                        continue;
                    default:
                        // push to results array by default
                        results.push(object);
                }
            }
        }

        return { results, omitted };
    }
}
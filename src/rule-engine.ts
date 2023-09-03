'use strict';

import type {
  ApplyRulesResponse,
  Condition,
  Effect,
  Rule,
  RuleError,
  UnknownObject,
} from './types';
import { Action, Operator } from './enums';
import {
  getObjectKeyValue,
  isPlainObject,
  runArithmeticComparisonGuard,
  setObjectKeyValue,
} from './helpers';

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
    if (this.rules[ruleName] != null) return this.rules[ruleName];
    throw new Error(`No rule found for ${ruleName}`);
  }

  /**
   * The first character of the `field` string is checked to see if it equals
   * `"$."`. e.g. if the string is `"$.downloadedTracks"`, it uses the
   * `getObjectKeyValue` method to check the provided object for a `downloadedTracks`
   * key. If the key is found, the value is returned. Else, it checks the fallback
   * object for a `downloadedTracks` key. However, if the provided `field` does
   * not start with `"$."`, that string is returned as is.
   *
   * You should provide a fallback object where one or more rules compare values
   * across different objects.
   */
  getFieldValue<T extends UnknownObject, F extends UnknownObject>(
    field: string | number,
    object: T,
    fallbackObject?: F,
  ): unknown {
    if (typeof field === 'string' && field.slice(0, 2) === '$.')
      return getObjectKeyValue(field, object, fallbackObject);

    return field;
  }

  /**
   * Constructs a string expression and evaluates whether the expression is truthy.
   * It uses `Function()`, a close relative to JavaScript `eval()`, to evaluate the
   * expression based on any of the operations defined under `Operation` enum.
   * This function can only compare numbers and strings (and arrays only when the
   * operator is CONTAINS).
   */
  conditionIsTruthy(
    left: number | string | Array<number | string>,
    operator: Operator,
    right: number | string,
  ): boolean {
    switch (operator) {
      case Operator.LESS_THAN:
        runArithmeticComparisonGuard(left, right);
        return left < right;
      case Operator.LESS_THAN_OR_EQUALS:
        runArithmeticComparisonGuard(left, right);
        return left <= right;
      case Operator.GREATER_THAN:
        runArithmeticComparisonGuard(left, right);
        return left > right;
      case Operator.GREATER_THAN_OR_EQUALS:
        runArithmeticComparisonGuard(left, right);
        return left >= right;
      case Operator.EQUALS:
        if (Number.isInteger(left) && Number.isInteger(right))
          return left === right;

        if (typeof left === 'string' && typeof right === 'string')
          return left.toLowerCase() === right.toLowerCase();

        throw new Error(
          'Compared values must be of the same type number or string',
        );
      case Operator.CONTAINS:
        if (!Array.isArray(left))
          throw new Error(
            'Left field should be an array when operator is CONTAINS',
          );

        return left.includes(right);
      default:
        throw new Error(`No handler defined for operator`);
    }
  }

  performArithmeticOperation<T extends UnknownObject>(
    object: T,
    effect: Effect,
  ): T {
    const { action } = effect;
    const { property } = effect;

    if (property == null || property === '' || Number.isInteger(property))
      throw new Error(
        `Cannot ${action} where effect property is undefined or invalid`,
      );

    const propertyValue = this.getFieldValue(property, object);

    if (
      typeof propertyValue !== 'number' ||
      effect.value == null ||
      !Number.isInteger(effect.value)
    ) {
      throw new Error(`Cannot ${action} a non-integer`);
    }

    if (![Action.INCREMENT, Action.DECREMENT].includes(action))
      throw new Error(`${action} action is invalid for arithmetic operation`);

    const newValue =
      action === Action.INCREMENT
        ? propertyValue + effect.value
        : propertyValue - effect.value;

    return setObjectKeyValue<T>(property, newValue, object);
  }

  runEffect<T extends UnknownObject>(
    target: T | T[],
    effect: Effect,
  ): T | Action {
    const clonedTarget = structuredClone(target);

    switch (effect.action) {
      case Action.INCREMENT:
      case Action.DECREMENT:
        if (isPlainObject(clonedTarget)) {
          return this.performArithmeticOperation<T>(clonedTarget, effect);
        }
        throw new Error(`Cannot perform ${effect.action} action on non-object`);
      case Action.OMIT:
        return effect.action;
      default:
        throw new Error(
          `No handler defined for "${effect.action}" action in runEffect`,
        );
    }
  }

  checkForMatchingRules<U extends UnknownObject, F extends UnknownObject>(
    object: U,
    fallback?: F,
  ): string[] {
    const matchedRules: string[] = [];

    for (const ruleName in this.rules) {
      const { conditions } = this.getRule(ruleName);
      let numberOfRulesMatched = 0;

      for (const condition of conditions) {
        const [leftField, operator, rightField] = condition;
        const left = this.getFieldValue(leftField, object, fallback);
        const right = this.getFieldValue(rightField, object, fallback);

        if (!(typeof right === 'string' || typeof right === 'number'))
          throw new Error("argument 'right' should be a string or number");

        if (
          !(
            typeof left === 'string' ||
            typeof left === 'number' ||
            Array.isArray(left)
          )
        )
          throw new Error(
            "argument 'left' should be a string, number or array",
          );

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

  applyRules<U extends UnknownObject, F extends UnknownObject>(
    objects: U[],
    fallback?: F,
  ): ApplyRulesResponse {
    const results: UnknownObject[] = [];
    const omitted: Array<[UnknownObject, RuleError | null]> = [];

    for (const object of objects) {
      const matchedRules: string[] = this.checkForMatchingRules(
        object,
        fallback,
      );

      if (matchedRules?.length === 0) {
        results.push(object);
        continue;
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
            if (effect?.error == null)
              throw new Error('Expected error on effect, but found none');
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

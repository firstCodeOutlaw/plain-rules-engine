'use strict';

import type {
  ApplyRulesResponse,
  Condition,
  Effect,
  Rule,
  RuleError,
  UnknownObject,
  ValidOperand,
} from './types';
import { Action, Operator } from './enums';
import {
  getObjectKeyValue,
  isPlainObject,
  runArithmeticComparisonGuard,
  setObjectKeyValue,
} from './helpers';
import isEqual from 'lodash/isEqual';

export class RuleEngine {
  private readonly rules: Rule;

  constructor(rules: Rule) {
    // TODO: add rule validator to validate rules passed to this class
    // we want to throw error for malformed rules
    this.rules = rules;
  }

  /**
   * Fetches a rule that is already loaded into this rule engine using the name
   * of the rule e.g. in
   * `{
   *     trackHasStrongLanguage: {...}
   * }`,
   * `getRule('trackHasStrongLanguage')` would return `{...}`
   */
  getRule(ruleName: string): { conditions: Condition[]; effect: Effect } {
    if (this.rules[ruleName] != null) return this.rules[ruleName];
    throw new Error(`No rule found for ${ruleName}`);
  }

  /**
   * The first character of the `field` string is checked to see if it equals
   * `"$."`. e.g. if the string is `"$.tags"`, it uses the
   * `getObjectKeyValue` method to check the provided object for a `tags`
   * key. If the key is found, the value is returned. Else, it checks the fallback
   * object for a `tags` key.
   *
   * However, if the provided `field` does
   * not start with `"$."`, that string is returned as is.
   *
   * You should provide a fallback object where one or more rules compare values
   * across different objects.
   */
  getFieldValue<T extends UnknownObject, F extends UnknownObject>(
    field: ValidOperand,
    object: T,
    fallbackObject?: F,
  ): unknown {
    if (typeof field === 'string' && field.slice(0, 2) === '$.')
      return getObjectKeyValue(field, object, fallbackObject);

    return field;
  }

  /**
   * Compares the `left` and `right` operands based on the `operator`, and returns
   * a boolean.
   */
  conditionIsTruthy(
    left: ValidOperand,
    operator: Operator,
    right: ValidOperand,
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
        if (typeof left === 'string' && typeof right === 'string')
          return left.toLowerCase() === right.toLowerCase();

        return isEqual(left, right);
      case Operator.CONTAINS:
        if (!Array.isArray(left))
          throw new Error(
            'Left field should be an array when operator is CONTAINS',
          );

        if (typeof right === 'boolean')
          throw new Error('Cannot check whether array contains boolean');

        return left.includes(right);
      default:
        throw new Error('No handler defined for operator');
    }
  }

  /**
   * Performs a decrement or increment action on the provided object as defined
   * in the rule effect
   */
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

  /**
   * Runs applicable effect against the provided `target` object or array of objects.
   * When `target` is an array of objects, then the action is definitely OMIT or
   * another action that aims at arrays.
   */
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

  /**
   * Checks the rules loaded into this rule engine against the provided `object` or
   * `fallback` object, and returns an array of rule names whose conditions are satisfied
   * by the object.
   */
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

  /**
   * Loops through the provided array of objects, checks for matching rules for
   * each object, and applies the applicable rule effect on each object.
   */
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

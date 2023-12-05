import type { UnknownObject, ValidOperand } from './types';
import set from 'lodash/set';
import get from 'lodash/get';
import { Action } from './enums';

export function isPlainObject(value: unknown): value is UnknownObject {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

export function runArithmeticComparisonGuard(
  left: ValidOperand,
  right: ValidOperand,
): void {
  if (typeof left !== 'number' || typeof right !== 'number')
    throw new Error('Both operands must be numbers');
}

export function setObjectKeyValue<T extends UnknownObject>(
  key: string,
  value: unknown,
  object: T,
): T {
  if (key.slice(0, 2) !== '$.')
    throw new Error('"$." notation is required to reference object key');

  const dotNotationKey = key.slice(2); // "$." excluded
  return set(object, dotNotationKey, value);
}

export function getObjectKeyValue<
  T extends UnknownObject,
  F extends UnknownObject,
>(
  key: string,
  object: T,
  fallbackObject?: F,
  throwObjectKeyNotFoundError: boolean = true,
): unknown {
  if (key.slice(0, 2) !== '$.')
    throw new Error('"$." notation is required to reference object key');

  const dotNotationKey = key.slice(2); // "$." excluded
  const value = get(object, dotNotationKey);
  if (typeof value !== 'undefined') return value;

  if (throwObjectKeyNotFoundError && fallbackObject == null)
    throw new Error(
      `Object has no ${key.substring(
        2,
      )} key, and no fallback object was provided`,
    );

  return get(fallbackObject, dotNotationKey);
}

/**
 * This function is a helper to applyRules method in the RuleEngine class.
 */
export function validateApplyRulesFeedback(
  feedback: UnknownObject | Action,
): UnknownObject {
  if (typeof feedback === 'string' && Object.values(Action).includes(feedback))
    throw new Error(
      'Caught an action that has no applyRules switch case. Please define one',
    );

  if (!isPlainObject(feedback)) throw new Error('Feedback must be an object');

  return feedback;
}

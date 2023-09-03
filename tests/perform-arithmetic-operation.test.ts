import { Action, type Effect, RuleEngine } from '../src';
import {
  cart,
  productWithPriceGreaterThan120,
  type RandomProduct,
  salesRules,
} from './mock/objects';

describe('Perform arithmetic operation', () => {
  const ruleEngine = new RuleEngine(salesRules);
  const { effect } = ruleEngine.getRule('addValueAddedTax');

  it('should throw an error if effect action is not INCREMENT or DECREMENT', () => {
    const clonedEffect = structuredClone<Effect>(effect);
    clonedEffect.action = Action.OMIT;
    const errorFunction = (): RandomProduct =>
      ruleEngine.performArithmeticOperation(
        productWithPriceGreaterThan120,
        clonedEffect,
      );

    expect(errorFunction).toThrowError(
      'omit action is invalid for arithmetic operation',
    );
  });

  it('should throw an error if effect has no "property" key', () => {
    const clonedEffect = structuredClone<Effect>(effect);
    delete clonedEffect.property;
    const errorFunction = (): RandomProduct =>
      ruleEngine.performArithmeticOperation(
        productWithPriceGreaterThan120,
        clonedEffect,
      );

    expect(errorFunction).toThrowError(
      'Cannot increment where effect property is undefined or invalid',
    );
  });

  it('should throw an error if effect has no "value" key', () => {
    const clonedEffect = structuredClone<Effect>(effect);
    delete clonedEffect.value;
    const errorFunction = (): RandomProduct =>
      ruleEngine.performArithmeticOperation(
        productWithPriceGreaterThan120,
        clonedEffect,
      );

    expect(errorFunction).toThrowError('Cannot increment a non-integer');
  });

  it('should throw an error if effect.value is not a number', () => {
    const clonedEffect = structuredClone<Effect>(effect);
    // @ts-expect-error: effect value should be a number
    clonedEffect.value = 'string';
    const errorFunction = (): RandomProduct =>
      ruleEngine.performArithmeticOperation(
        productWithPriceGreaterThan120,
        clonedEffect,
      );

    expect(errorFunction).toThrowError('Cannot increment a non-integer');
  });

  it('should throw an error if effect.property does not exist on target object', () => {
    const clonedTargetObject = structuredClone(productWithPriceGreaterThan120);
    // @ts-expect-error: 'price' is not optional. TS compiler throws an error because we want to delete it
    delete clonedTargetObject.price;
    const errorFunction = (): RandomProduct =>
      ruleEngine.performArithmeticOperation(clonedTargetObject, effect);

    expect(errorFunction).toThrowError(
      'Object has no price key, and no fallback object was provided',
    );
  });

  it('should perform INCREMENT action on object', () => {
    const priceBeforeArithmeticOperation = productWithPriceGreaterThan120.price;
    const result = ruleEngine.performArithmeticOperation(
      productWithPriceGreaterThan120,
      effect,
    );
    const priceAfterArithmeticOperation = result.price;

    expect(priceBeforeArithmeticOperation).toBe(128);
    expect(priceAfterArithmeticOperation).toBe(136);
  });

  it('should perform DECREMENT action on object', () => {
    const amountBeforeArithmeticOperation = cart.purchase.amountTotalDiscounted;
    const ruleEngine = new RuleEngine(salesRules);
    const { effect } = ruleEngine.getRule('applyStudentDiscount');
    const result = ruleEngine.performArithmeticOperation(cart, effect);
    const amountAfterArithmeticOperation =
      result.purchase.amountTotalDiscounted;

    expect(amountBeforeArithmeticOperation).toBe(216);
    expect(amountAfterArithmeticOperation).toBe(211);
  });
});

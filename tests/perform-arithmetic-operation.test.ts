import {RuleEngine} from "../src";
import {Effect} from "../src/types";
import {productWithPriceGreaterThan120, salesRules} from "./mock/objects";

describe('Perform arithmetic operation', () => {
    const ruleEngine = new RuleEngine(salesRules);
    const { effect } = ruleEngine.getRule('addValueAddedTax');

    it('should throw an error if effect has no "property" key', () => {
        const clonedEffect = structuredClone<Effect>(effect);
        delete clonedEffect.property;
        const errorFunction = () => ruleEngine.performArithmeticOperation(
            productWithPriceGreaterThan120,
            clonedEffect,
        );

        expect(errorFunction)
            .toThrowError('Cannot increment where effect property is undefined');
    });

    it('should throw an error if effect has no "value" key', () => {
        const clonedEffect = structuredClone<Effect>(effect);
        delete clonedEffect.value;
        const errorFunction = () => ruleEngine.performArithmeticOperation(
            productWithPriceGreaterThan120,
            clonedEffect,
        );

        expect(errorFunction).toThrowError('Effect value is either undefined or not a number');
    });

    it('should throw an error if effect.value is not a number', () => {
        const clonedEffect = structuredClone<Effect>(effect);
        // @ts-expect-error: effect value should be a number
        clonedEffect.value = 'string';
        const errorFunction = () => ruleEngine.performArithmeticOperation(
            productWithPriceGreaterThan120,
            clonedEffect,
        );

        expect(errorFunction).toThrowError('Effect value is either undefined or not a number');
    });

    it('should throw an error if targetObject is not an object', () => {
        const errorFunction = () => ruleEngine.performArithmeticOperation(
            // @ts-expect-error: first argument should an object
            'string',
            effect,
        );

        expect(errorFunction).toThrowError('Cannot increment a non-integer');
    });

    it('should throw an error if property "price" does not exist on target object', () => {
        const clonedTargetObject = structuredClone(productWithPriceGreaterThan120);
        // @ts-expect-error: 'price' is not optional. TS compiler throws an error because we want to delete it
        delete clonedTargetObject.price;
        const errorFunction = () => ruleEngine.performArithmeticOperation(
            clonedTargetObject,
            effect,
        );

        expect(errorFunction)
            .toThrowError('Cannot increment a non-integer');
    });

    it('should perform arithmetic operation on object', () => {
        const priceBeforeArithmeticOperation = productWithPriceGreaterThan120.price;
        const result = ruleEngine.performArithmeticOperation(
            productWithPriceGreaterThan120,
            effect,
        );
        const priceAfterArithmeticOperation = result.price;

        expect(priceBeforeArithmeticOperation).toBe(128);
        expect(priceAfterArithmeticOperation).toBe(136);
        expect(result).toStrictEqual({
            product: 'banana 3kg',
            price: 136,
            isTaxable: 1,
        });
    });
});
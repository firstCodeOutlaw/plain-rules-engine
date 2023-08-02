import {RuleEngine} from "../src";
import {
    type RandomCart,
    type RandomProduct,
    cart,
    productWithPriceGreaterThan120,
    salesRules,
    safeTrack, trackWithStrongLanguage, musicTrackRules
} from "./mock/objects";
import {Effect} from "../src/types";
import {Action} from "../src/enums";

describe('Run effect', () => {
    describe('Action.INCREMENT', () => {
        let ruleEngine: RuleEngine;
        let effect: Effect;

        beforeAll(() => {
            ruleEngine = new RuleEngine(salesRules);
            effect = ruleEngine.getRule('addValueAddedTax').effect;
        });

        it('should increase object value by effect value', () => {
            const previousValue = productWithPriceGreaterThan120.price;
            const { price: newValue } = ruleEngine.runEffect(productWithPriceGreaterThan120, effect) as RandomProduct;

            expect(previousValue).toBe(128);
            expect(newValue).toBe(136);
        });

        it('should throw an error if target passed to runEffect is not an object', () => {
            const productsArray = [
                productWithPriceGreaterThan120,
            ];

            expect(() => ruleEngine.runEffect(productsArray, effect))
                .toThrowError('Cannot perform increment action on non-object');
        });
    });

    describe('Action.DECREMENT', () => {
        let ruleEngine: RuleEngine;
        let effect: Effect;

        beforeAll(() => {
            ruleEngine = new RuleEngine(salesRules);
            effect = ruleEngine.getRule('applyStudentDiscount').effect;
        });

        it('should decrease object value by effect value', () => {
            const previousValue = cart.purchase.amountTotalDiscounted;
            const { purchase: { amountTotalDiscounted: newValue } } = ruleEngine.runEffect(cart, effect) as RandomCart;

            expect(previousValue).toBe(216);
            expect(newValue).toBe(211);
        });

        it('should throw an error if target passed to runEffect is not an object', () => {
            const cartsArray = [
                cart,
            ];

            expect(() => ruleEngine.runEffect(cartsArray, effect))
                .toThrowError('Cannot perform decrement action on non-object');
        });
    });

    describe('Action.OMIT', () => {
        it('should return action', () => {
            const tracks = [
                safeTrack,
                trackWithStrongLanguage,
            ];
            const ruleEngine = new RuleEngine(musicTrackRules);
            const { effect } = ruleEngine.getRule('trackHasStrongLanguage');
            const result = ruleEngine.runEffect(tracks, effect);

            expect(result).toBe(Action.OMIT);
        });
    });
});
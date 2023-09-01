import {flatObject, nestedObject, productWithPriceLessThan120} from "./mock/objects";
import {setObjectKeyValue} from "../src/helpers";

describe('Set object key value', () => {
    it('should throw error if key does not start with "$."', () => {
        const keyWithoutDollarSign = 'firstName';
        expect(() => setObjectKeyValue(keyWithoutDollarSign, 'Bruce', flatObject))
            .toThrowError('"$." notation is required to reference object key');
    });

    describe('nested object', () => {
        it('should replace key value using dot notation if key exists', () => {
            const result = setObjectKeyValue(
                '$.purchase.amountTotalDiscounted',
                201,
                nestedObject,
            );

            expect(result).toStrictEqual({
                customerType: 'student',
                purchase: {
                    items: [
                        productWithPriceLessThan120,
                        productWithPriceLessThan120,
                    ],
                    amountTotal: 216,
                    amountTotalDiscounted: 201,
                }
            });
        });

        it('should set key value using dot notation if key DOES NOT exist', () => {
            const result = setObjectKeyValue(
                '$.purchase.isTaxable',
                false,
                nestedObject,
            );

            expect(result).toStrictEqual({
                customerType: 'student',
                purchase: {
                    items: [
                        productWithPriceLessThan120,
                        productWithPriceLessThan120,
                    ],
                    amountTotal: 216,
                    amountTotalDiscounted: 201,
                    isTaxable: false,
                }
            });
        });
    });

    describe('flat object', () => {
        it('should replace key value if key exists', () => {
            const result = setObjectKeyValue(
                '$.firstName',
                'Jane',
                flatObject,
            );

            expect(result).toStrictEqual({
                firstName: 'Jane',
                lastName: 'Doe',
                age: 35,
            });
        });

        it('should set key value if key DOES NOT exist', () => {
            const result = setObjectKeyValue(
                '$.gender',
                'male',
                flatObject,
            );

            expect(result).toStrictEqual({
                firstName: 'Jane',
                lastName: 'Doe',
                age: 35,
                gender: 'male',
            });
        });
    });
});
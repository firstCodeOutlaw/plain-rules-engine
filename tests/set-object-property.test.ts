import {flatObject, nestedObject, productWithPriceLessThan120} from "./mock/objects";
import {setObjectProperty} from "../src/helpers";

describe('Set object property', () => {
    describe('nested object', () => {
        it('should replace key value using dot notation if key exists', () => {
            const result = setObjectProperty(
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
            const result = setObjectProperty(
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
        it('should throw an error if dot notation is used', () => {
            expect(() => setObjectProperty(
                '$.purchase.amountTotalDiscounted',
                201,
                flatObject,
            )).toThrowError('Cannot use dot notation on flat object');
        });

        it('should replace key value if key exists', () => {
            const result = setObjectProperty(
                'firstName',
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
            const result = setObjectProperty(
                'gender',
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
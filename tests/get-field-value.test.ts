import Rules from './mock/rules';
import {RuleEngine} from "../src";
import type {Rule} from "../src/types";

const object = { name: 'John', age: 21 };
const getObjectKeyValueMock = jest
    .spyOn(RuleEngine.prototype, 'getObjectKeyValue')
    .mockImplementation(
        (field, object: Record<string, string|number|string[]>) => object[field]
    );

describe('Get field value', () => {
    const rules: Rule = JSON.parse(Rules);
    const ruleEngine = new RuleEngine(rules);

    describe('where key does not starts with dollar sign', () => {
        beforeEach(() => {
            getObjectKeyValueMock.mockClear();
        });

        it('should return the key as is', () => {
            const field = 'name';
            const value = ruleEngine.getFieldValue(field, object);

            expect(value).toBe('name');
            expect(getObjectKeyValueMock).not.toHaveBeenCalled();
        });
    });

    describe('where key starts with dollar sign', () => {
        describe('and key exists on object', () => {
            beforeEach(() => {
                getObjectKeyValueMock.mockClear();
            });

            it('should call getObjectKeyValue once', () => {
                const field = '$.name';
                ruleEngine.getFieldValue(field, object);
                expect(getObjectKeyValueMock).toHaveBeenCalledTimes(1);
                expect(getObjectKeyValueMock).toHaveBeenCalledWith('name', object);
            });

            it('should fetch the value of the object key', () => {
                const field = '$.name';
                const value = ruleEngine.getFieldValue(field, object);
                expect(value).toBe('John');
            });
        });

        describe('and key does not exist on object', () => {
            beforeEach(() => {
                getObjectKeyValueMock.mockClear();
            });

            const key = '$.hobbies';
            const fallbackObject = {
                hobbies: ['skiing', 'windsurfing'],
                numberOfChildren: 2,
            };

            it('should throw an error if fallback object is not provided', () => {
                const nonExistentKey = '$.abc';
                expect(() => ruleEngine.getFieldValue(nonExistentKey, object))
                    .toThrowError(`Object has no ${nonExistentKey.substring(2)} key, and no fallback object was provided`);
            });

            it('should use fallback object', () => {
                const value = ruleEngine.getFieldValue(key, object, fallbackObject);
                expect(value).toStrictEqual(fallbackObject.hobbies);
            });

            it('should call getObjectKeyValue twice', () => {
                ruleEngine.getFieldValue(key, object, fallbackObject);
                expect(getObjectKeyValueMock).toHaveBeenCalledTimes(2);
                expect(getObjectKeyValueMock).toHaveBeenNthCalledWith(1, 'hobbies', object);
                expect(getObjectKeyValueMock).toHaveBeenNthCalledWith(2, 'hobbies', fallbackObject);
            });
        });
    });
});
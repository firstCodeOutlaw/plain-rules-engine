import Rules from './mock/rules';
import {RuleEngine} from "../src";
import type {Rule} from "../src/types";
import * as Helpers from '../src/helpers';
import {safeTrack} from "./mock/objects";

const getObjectKeyValueMock = jest
    .spyOn(Helpers, 'getObjectKeyValue')
    .mockImplementation();

describe('Get field value', () => {
    const rules: Rule = JSON.parse(Rules);
    const ruleEngine = new RuleEngine(rules);

    describe('field is of type "string"', () => {
        afterAll(() => {
            getObjectKeyValueMock.mockClear();
        });

        it('should call getObjectKeyValue', () => {
            ruleEngine.getFieldValue('$.title', safeTrack);

            expect(getObjectKeyValueMock).toHaveBeenCalledTimes(1);
            expect(getObjectKeyValueMock)
                .toHaveBeenCalledWith('$.title', safeTrack, undefined);
        });
    });

    describe('field is NOT of type "string"', () => {
        it('should return the key as is', () => {
            const field = 12;
            const value = ruleEngine.getFieldValue(field, safeTrack);

            expect(value).toBe(12);
        });
    });
});
import Rules from './mock/rules';
import {RuleEngine} from "../src";
import type {Rule} from "../src/types";

describe('Is plain object', () => {
    const rules: Rule = JSON.parse(Rules);
    const ruleEngine = new RuleEngine(rules);

    it('should return true if value is an object', () => {
        const value = {
            title: "Heal the World",
            artist: "Michael Jackson",
            year: 1991,
            album: "Dangerous",
            tags: ["pop", "society"],
        };
        const isAnObject = ruleEngine.isPlainObject(value);

        expect(isAnObject).toBe(true);
    });

    it('should return false if value is an array', () => {
        const value = ['an', 'array'];
        const isAnObject = ruleEngine.isPlainObject(value);

        expect(isAnObject).toBe(false);
    });

    it('should return false if value is a string', () => {
        const value = 'string';
        const isAnObject = ruleEngine.isPlainObject(value);

        expect(isAnObject).toBe(false);
    });

    it('should return false if value is a number', () => {
        const value = 1;
        const isAnObject = ruleEngine.isPlainObject(value);

        expect(isAnObject).toBe(false);
    });

    it('should return false if value is null', () => {
        const value = null;
        const isAnObject = ruleEngine.isPlainObject(value);

        expect(isAnObject).toBe(false);
    });

    it('should return false if value is undefined', () => {
        const value = undefined;
        const isAnObject = ruleEngine.isPlainObject(value);

        expect(isAnObject).toBe(false);
    });

    it('should return false if value is a function', () => {
        const value = function () {
            console.log('Function was called...');
        };
        const isAnObject = ruleEngine.isPlainObject(value);

        expect(isAnObject).toBe(false);
    });
});
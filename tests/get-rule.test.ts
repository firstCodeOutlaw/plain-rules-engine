import Rules from './mock/rules';
import {RuleEngine, type Rule} from "../src";

describe('Get rule', () => {
    const rules: Rule = JSON.parse(Rules);
    const ruleEngine = new RuleEngine(rules);

    it('should fetch rule by rule name', () => {
        const ruleName = 'trackHasStrongLanguage';
        const rule = ruleEngine.getRule(ruleName);

        expect(rule).toStrictEqual({
            "conditions": [
                [
                    "$.loggedInUser.age",
                    "lessThan",
                    13
                ],
                [
                    "$.tags",
                    "contains",
                    "strong language"
                ]
            ],
            "effect": {
                "action": "omit"
            }
        });
    });

    it('should throw an error if rule does not exist', () => {
        const ruleName = 'undefined rule';

        expect(() => ruleEngine.getRule(ruleName))
            .toThrowError(`No rule found for ${ruleName}`);

    });
});
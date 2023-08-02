import Rules from './mock/rules';
import {RuleEngine} from "../src";
import type {Rule} from "../src/types";
import {Operator} from "../src/enums";

describe('Get operator', () => {
    const rules: Rule = JSON.parse(Rules);
    const ruleEngine = new RuleEngine(rules);

    it('should fetch CONTAINS operator by name', () => {
        const operatorName = Operator.CONTAINS;
        const operator = ruleEngine.getOperator(operatorName);

        expect(operator).toBe('contains');
    });

    it('should fetch EQUALS operator by name', () => {
        const operatorName = Operator.EQUALS;
        const operator = ruleEngine.getOperator(operatorName);

        expect(operator).toBe('===');
    });

    it('should fetch GREATER THAN operator by name', () => {
        const operatorName = Operator.GREATER_THAN;
        const operator = ruleEngine.getOperator(operatorName);

        expect(operator).toBe('>');
    });

    it('should fetch GREATER THAN OR EQUALS operator by name', () => {
        const operatorName = Operator.GREATER_THAN_OR_EQUALS;
        const operator = ruleEngine.getOperator(operatorName);

        expect(operator).toBe('>=');
    });

    it('should fetch LESS THAN operator by name', () => {
        const operatorName = Operator.LESS_THAN;
        const operator = ruleEngine.getOperator(operatorName);

        expect(operator).toBe('<');
    });

    it('should fetch LESS THAN OR EQUALS operator by name', () => {
        const operatorName = Operator.LESS_THAN_OR_EQUALS;
        const operator = ruleEngine.getOperator(operatorName);

        expect(operator).toBe('<=');
    });

    it('should throw an error if operator is not found', () => {
        const nonExistentOperator = '*';
        // @ts-expect-error: "*" is not a type of Operator enum
        expect(() => ruleEngine.getOperator(nonExistentOperator))
            .toThrowError(`No matching operator found for ${nonExistentOperator}`);
    });
});
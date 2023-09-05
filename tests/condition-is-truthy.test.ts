import Rules from './mock/rules';
import { Operator, RuleEngine, type Rule } from '../src';

const errorMessage = 'Both operands must be numbers';

describe('Condition is truthy', () => {
  const rules: Rule = JSON.parse(Rules);
  const ruleEngine = new RuleEngine(rules);

  describe('LESS_THAN operator', () => {
    it('should return false if left value is greater than right', () => {
      const result = ruleEngine.conditionIsTruthy(5, Operator.LESS_THAN, 3);

      expect(result).toBe(false);
    });

    it('should return false if left value is equal to right', () => {
      const result = ruleEngine.conditionIsTruthy(5, Operator.LESS_THAN, 5);

      expect(result).toBe(false);
    });

    it('should return true if left value is less than right', () => {
      const result = ruleEngine.conditionIsTruthy(900, Operator.LESS_THAN, 905);

      expect(result).toBe(true);
    });

    it('should throw an error if left field is not a number', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy('900', Operator.LESS_THAN, 905),
      ).toThrowError(errorMessage);
    });

    it('should throw an error if right field is not a number', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy(900, Operator.LESS_THAN, '905'),
      ).toThrowError(errorMessage);
    });
  });

  describe('LESS_THAN_OR_EQUALS operator', () => {
    it('should return false if left value is greater than right', () => {
      const result = ruleEngine.conditionIsTruthy(
        5,
        Operator.LESS_THAN_OR_EQUALS,
        3,
      );

      expect(result).toBe(false);
    });

    it('should return true if left value is less than right', () => {
      const result = ruleEngine.conditionIsTruthy(
        900,
        Operator.LESS_THAN_OR_EQUALS,
        905,
      );

      expect(result).toBe(true);
    });

    it('should return true if left value is equal to right', () => {
      const result = ruleEngine.conditionIsTruthy(
        90,
        Operator.LESS_THAN_OR_EQUALS,
        90,
      );

      expect(result).toBe(true);
    });

    it('should throw an error if left field is not a number', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy('90', Operator.LESS_THAN_OR_EQUALS, 95),
      ).toThrowError(errorMessage);
    });

    it('should throw an error if right field is not a number', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy(90, Operator.LESS_THAN_OR_EQUALS, '95'),
      ).toThrowError(errorMessage);
    });
  });

  describe('GREATER_THAN operator', () => {
    it('should return false if left value is less than right', () => {
      const result = ruleEngine.conditionIsTruthy(3, Operator.GREATER_THAN, 5);

      expect(result).toBe(false);
    });

    it('should return false if left value is equal to right', () => {
      const result = ruleEngine.conditionIsTruthy(5, Operator.GREATER_THAN, 5);

      expect(result).toBe(false);
    });

    it('should return true if left value is greater than right', () => {
      const result = ruleEngine.conditionIsTruthy(
        95,
        Operator.GREATER_THAN,
        90,
      );

      expect(result).toBe(true);
    });

    it('should throw an error if left field is not a number', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy('90', Operator.GREATER_THAN, 95),
      ).toThrowError(errorMessage);
    });

    it('should throw an error if right field is not a number', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy(99, Operator.GREATER_THAN, '95'),
      ).toThrowError(errorMessage);
    });
  });

  describe('GREATER_THAN_OR_EQUALS operator', () => {
    it('should return false if left value is less than right', () => {
      const result = ruleEngine.conditionIsTruthy(
        5000,
        Operator.GREATER_THAN_OR_EQUALS,
        300_000,
      );

      expect(result).toBe(false);
    });

    it('should return true if left value is greater than right', () => {
      const result = ruleEngine.conditionIsTruthy(
        900,
        Operator.GREATER_THAN_OR_EQUALS,
        85,
      );

      expect(result).toBe(true);
    });

    it('should return true if left value is equal to right', () => {
      const result = ruleEngine.conditionIsTruthy(
        90,
        Operator.GREATER_THAN_OR_EQUALS,
        90,
      );

      expect(result).toBe(true);
    });

    it('should throw an error if left field is not a number', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy(
          '5000',
          Operator.GREATER_THAN_OR_EQUALS,
          5000,
        ),
      ).toThrowError(errorMessage);
    });

    it('should throw an error if right field is not a number', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy(
          5000,
          Operator.GREATER_THAN_OR_EQUALS,
          '5000',
        ),
      ).toThrowError(errorMessage);
    });
  });

  describe('EQUALS operator', () => {
    describe('string', () => {
      it('should return true if both left and right strings are equal', () => {
        const result = ruleEngine.conditionIsTruthy(
          'green',
          Operator.EQUALS,
          'green',
        );

        expect(result).toBe(true);
      });

      it('should return false if both left and right strings are not equal', () => {
        const result = ruleEngine.conditionIsTruthy(
          'green',
          Operator.EQUALS,
          'blue',
        );

        expect(result).toBe(false);
      });
    });

    describe('number', () => {
      it('should return true if both left and right numbers are equal', () => {
        const result = ruleEngine.conditionIsTruthy(500, Operator.EQUALS, 500);

        expect(result).toBe(true);
      });

      it('should return false if both left and right numbers are not equal', () => {
        const result = ruleEngine.conditionIsTruthy(500, Operator.EQUALS, 501);

        expect(result).toBe(false);
      });
    });

    describe('object', () => {
      it('should return true if both left and right objects are equal', () => {
        const object1 = { a: 1, b: 2 };
        const object2 = { a: 1, b: 2 };
        const result = ruleEngine.conditionIsTruthy(
          object1,
          Operator.EQUALS,
          object2,
        );

        expect(result).toBe(true);
      });

      it('should return false if both left and right objects are not equal', () => {
        const object1 = { a: 1, b: 2 };
        const object2 = { a: 1, b: 5 };
        const result = ruleEngine.conditionIsTruthy(
          object1,
          Operator.EQUALS,
          object2,
        );

        expect(result).toBe(false);
      });
    });

    describe('array', () => {
      it('should return true if both left and right arrays are equal', () => {
        const array1 = ['first', { a: 1, b: 2 }];
        const array2 = ['first', { a: 1, b: 2 }];
        const result = ruleEngine.conditionIsTruthy(
          array1,
          Operator.EQUALS,
          array2,
        );

        expect(result).toBe(true);
      });

      it('should return false if both left and right arrays are not equal', () => {
        const array1 = ['first', { a: 1, b: 2 }];
        const array2 = ['second', { a: 1, b: 2 }];
        const result = ruleEngine.conditionIsTruthy(
          array1,
          Operator.EQUALS,
          array2,
        );

        expect(result).toBe(false);
      });
    });

    describe('boolean', () => {
      it('should return true if both left and right booleans are equal', () => {
        const result = ruleEngine.conditionIsTruthy(
          true,
          Operator.EQUALS,
          true,
        );

        expect(result).toBe(true);
      });

      it('should return false if both left and right booleans are not equal', () => {
        const result = ruleEngine.conditionIsTruthy(
          true,
          Operator.EQUALS,
          false,
        );

        expect(result).toBe(false);
      });
    });
  });

  describe('CONTAINS operator', () => {
    it('should throw an error if left is not an array', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy('long text', Operator.CONTAINS, 'text'),
      ).toThrowError('Left field should be an array when operator is CONTAINS');
    });

    it('should throw an error if right is boolean', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy([1, 2], Operator.CONTAINS, true),
      ).toThrowError('Cannot check whether array contains boolean');
    });

    describe('array of mixed values', () => {
      it('should return false if array does not contain right', () => {
        const result = ruleEngine.conditionIsTruthy(
          ['text', 500, 120],
          Operator.CONTAINS,
          250,
        );

        expect(result).toBe(false);
      });

      it('should return true if array contains right', () => {
        const result = ruleEngine.conditionIsTruthy(
          [500, 'random text', 3_400],
          Operator.CONTAINS,
          500,
        );

        expect(result).toBe(true);
      });
    });

    describe('array of numbers', () => {
      it('should return false if array does not contain right', () => {
        const result = ruleEngine.conditionIsTruthy(
          [24_000, 500, 120],
          Operator.CONTAINS,
          250,
        );

        expect(result).toBe(false);
      });

      it('should return true if array contains right', () => {
        const result = ruleEngine.conditionIsTruthy(
          [24_000, 500, 120],
          Operator.CONTAINS,
          24_000,
        );

        expect(result).toBe(true);
      });
    });

    describe('array of strings', () => {
      it('should return false if array does not contain right', () => {
        const result = ruleEngine.conditionIsTruthy(
          ['green', 'red', 'amber'],
          Operator.CONTAINS,
          'blue',
        );

        expect(result).toBe(false);
      });

      it('should return true if array contains right', () => {
        const result = ruleEngine.conditionIsTruthy(
          ['green', 'red', 'amber'],
          Operator.CONTAINS,
          'amber',
        );

        expect(result).toBe(true);
      });
    });
  });

  describe('Invalid operator', () => {
    it('should throw an error', () => {
      expect(() => {
        // @ts-expect-error: "Invalid operator" is not a type of Operator
        ruleEngine.conditionIsTruthy(5, 'Invalid operator', 3);
      }).toThrowError('No handler defined for operator');
    });
  });
});

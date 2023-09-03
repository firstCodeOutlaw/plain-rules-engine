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
    describe('where either left or right field are not of the same type', () => {
      it('should throw an error if left is number and right is string', () => {
        expect(() =>
          ruleEngine.conditionIsTruthy(20, Operator.EQUALS, '20'),
        ).toThrowError('Compared values must be of the same type');
      });

      it('should throw an error if left is string and right is number', () => {
        expect(() =>
          ruleEngine.conditionIsTruthy('20', Operator.EQUALS, 20),
        ).toThrowError('Compared values must be of the same type');
      });
    });

    describe('where any of left or right field is not of type number or string', () => {
      it('should throw an error for arrays', () => {
        expect(() => {
          // @ts-expect-error: conditionIsTruthy() cannot take arguments of type 'array'
          ruleEngine.conditionIsTruthy([2, 3], Operator.EQUALS, [2, 3]);
        }).toThrowError(
          'Compared values must be of the same type number or string',
        );
      });

      it('should throw an error for objects', () => {
        expect(() => {
          // @ts-expect-error: conditionIsTruthy() cannot take arguments of type 'object'
          ruleEngine.conditionIsTruthy({ a: 1, b: 2 }, Operator.EQUALS, {
            a: 1,
            b: 2,
          });
        }).toThrowError(
          'Compared values must be of the same type number or string',
        );
      });

      it('should throw an error for functions', () => {
        const funcA = (): string => 'This is function A';
        const funcB = (): string => 'This is function B';

        expect(() => {
          // @ts-expect-error: conditionIsTruthy() cannot take function arguments
          ruleEngine.conditionIsTruthy(funcA, Operator.EQUALS, funcB);
        }).toThrowError(
          'Compared values must be of the same type number or string',
        );
      });
    });

    describe('where left and right field are of the same type', () => {
      it('should return true if both left and right numbers are equal', () => {
        const result = ruleEngine.conditionIsTruthy(500, Operator.EQUALS, 500);

        expect(result).toBe(true);
      });

      it('should return true if both left and right numbers are not equal', () => {
        const result = ruleEngine.conditionIsTruthy(500, Operator.EQUALS, 501);

        expect(result).toBe(false);
      });

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
  });

  describe('CONTAINS operator', () => {
    it('should throw an error if left is not an array', () => {
      expect(() =>
        ruleEngine.conditionIsTruthy('long text', Operator.CONTAINS, 'text'),
      ).toThrowError('Left field should be an array when operator is CONTAINS');
    });

    it('should throw an error if right is an array', () => {
      expect(() => {
        // @ts-expect-error: third argument should be a number of string
        ruleEngine.conditionIsTruthy('text', Operator.CONTAINS, [2, 3]);
      }).toThrowError(
        'Left field should be an array when operator is CONTAINS',
      );
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
});

import { validateApplyRulesFeedback } from '../src/helpers';
import { Action } from '../src';
import { safeTrack } from './mock/objects';

describe('Validate apply rules feedback', () => {
  it('should throw an error if feedback is an action', () => {
    expect(() => {
      validateApplyRulesFeedback(Action.ADD);
    }).toThrowError(
      'Caught an action that has no applyRules switch case. Please define one',
    );
  });

  it('should throw an error if feedback is not an object', () => {
    expect(() => {
      // @ts-expect-error: validateApplyRulesFeedback does take a string
      validateApplyRulesFeedback('string');
    }).toThrowError('Feedback must be an object');
  });

  it('should return the feedback if it is an object', () => {
    const feedback = safeTrack;
    const result = validateApplyRulesFeedback(feedback);

    expect(result).toEqual(feedback);
  });
});

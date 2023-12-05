import { otherMusicTrackRules, safeTrack } from './mock/objects';
import { RuleEngine } from '../src';

describe('Handle add action', () => {
  it('should update object key value', () => {
    const ruleEngine = new RuleEngine(otherMusicTrackRules);
    const { effect } = ruleEngine.getRule('trackShouldBeMarkedAsDownloaded');
    const result = ruleEngine.handleAddAction(safeTrack, effect);

    expect(result).toHaveProperty('isDownloaded');
    expect(result).toEqual({
      ...safeTrack,
      isDownloaded: true,
    });
  });

  describe('malformed rule effect', () => {
    const expectedErrorMessage =
      'Cannot set object key because effect value or property is undefined/invalid';

    it('should throw an error if effect property is null', () => {
      const ruleWithNullEffectProperty = structuredClone(otherMusicTrackRules);
      // @ts-expect-error: you can't assign null to effect property
      ruleWithNullEffectProperty.trackShouldBeMarkedAsDownloaded.effect.property =
        null;
      const ruleEngine = new RuleEngine(ruleWithNullEffectProperty);
      const { effect } = ruleEngine.getRule('trackShouldBeMarkedAsDownloaded');

      expect(() => {
        ruleEngine.handleAddAction(safeTrack, effect);
      }).toThrowError(expectedErrorMessage);
    });

    it('should throw an error if effect property is an empty string', () => {
      const ruleWithEmptyEffectProperty = structuredClone(otherMusicTrackRules);
      ruleWithEmptyEffectProperty.trackShouldBeMarkedAsDownloaded.effect.property =
        '';
      const ruleEngine = new RuleEngine(ruleWithEmptyEffectProperty);
      const { effect } = ruleEngine.getRule('trackShouldBeMarkedAsDownloaded');

      expect(() => {
        ruleEngine.handleAddAction(safeTrack, effect);
      }).toThrowError(expectedErrorMessage);
    });

    it('should throw an error if effect value is undefined', () => {
      const ruleWithEmptyEffectProperty = structuredClone(otherMusicTrackRules);
      ruleWithEmptyEffectProperty.trackShouldBeMarkedAsDownloaded.effect.value =
        undefined;
      const ruleEngine = new RuleEngine(ruleWithEmptyEffectProperty);
      const { effect } = ruleEngine.getRule('trackShouldBeMarkedAsDownloaded');

      expect(() => {
        ruleEngine.handleAddAction(safeTrack, effect);
      }).toThrowError(expectedErrorMessage);
    });
  });
});

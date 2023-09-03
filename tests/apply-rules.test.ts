import { RuleEngine } from '../src';
import {
  anotherSafeTrack,
  loggedInUserNormal,
  loggedInUserUnderage,
  musicTrackRules,
  safeTrack,
  trackWithEmptyTitle,
  trackWithStrongLanguage,
} from './mock/objects';

describe('Apply rules', () => {
  describe('no objects in array match rule conditions', () => {
    it('should return all objects', () => {
      const tracks = [safeTrack, anotherSafeTrack];
      const ruleEngine = new RuleEngine(musicTrackRules);
      const { results } = ruleEngine.applyRules(tracks, loggedInUserNormal);

      expect(results.length).toBe(2);
      expect(results).toStrictEqual(tracks);
    });
  });

  describe('objects in array match one or more rule conditions', () => {
    it('should apply rule effect on objects that match rule conditions', () => {
      const ruleEngine = new RuleEngine(musicTrackRules);
      const tracks = [safeTrack, trackWithStrongLanguage, trackWithEmptyTitle];
      const { results, omitted } = ruleEngine.applyRules(
        tracks,
        loggedInUserUnderage,
      );

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results).toStrictEqual([safeTrack]);
      expect(Array.isArray(omitted)).toBe(true);
      expect(omitted?.length).toBe(2);
      expect(omitted).toStrictEqual([
        [trackWithStrongLanguage, null],
        [trackWithEmptyTitle, null],
      ]);
    });
  });
});

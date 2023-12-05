import { otherMusicTrackRules, safeTrack } from './mock/objects';
import { RuleEngine } from '../src';

describe('Rules', () => {
  describe('trackShouldBeMarkedAsDownloaded', () => {
    it('should mark already downloaded tracks as isDownloaded', () => {
      // sample search results for "world" in an imaginary music streaming app
      const searchResults = [
        safeTrack,
        {
          title: 'Change the World',
          artist: 'Sizwe Banzi',
          year: 2019,
          album: 'Sizwe',
          tags: ['pop'],
        },
        {
          title: 'Worlds and Above',
          artist: 'Mitchel Diaz',
          year: 1987,
          album: 'High Soul',
          tags: ['pop'],
        },
      ];
      const deviceStorage = {
        downloads: {
          trackTitles: ['Change the World'],
        },
      };
      const ruleEngine = new RuleEngine(otherMusicTrackRules);
      const { results } = ruleEngine.applyRules(searchResults, deviceStorage);

      expect(results.length).toBe(3);
      expect(results[1]).toEqual({
        title: 'Change the World',
        artist: 'Sizwe Banzi',
        year: 2019,
        album: 'Sizwe',
        tags: ['pop'],
        isDownloaded: true,
      });
      expect(results[0]).not.toHaveProperty('isDownloaded');
      expect(results[2]).not.toHaveProperty('isDownloaded');
    });
  });
});

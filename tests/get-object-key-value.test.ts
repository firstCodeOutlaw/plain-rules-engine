import { getObjectKeyValue } from '../src/helpers';
import { nestedAlbumObject, safeTrack } from './mock/objects';

describe('Get object key value', () => {
  it('should throw error if key does not start with "$."', () => {
    const keyWithoutDollarSign = 'title';
    expect(() =>
      getObjectKeyValue(keyWithoutDollarSign, safeTrack),
    ).toThrowError('"$." notation is required to reference object key');
  });

  describe('flat object', () => {
    it('should fetch an object key whose value is a string', () => {
      const result = getObjectKeyValue('$.title', safeTrack);

      expect(typeof result).toBe('string');
      expect(result).toBe('Heal the World');
    });

    it('should fetch an object key whose value is a number', () => {
      const result = getObjectKeyValue('$.year', safeTrack);

      expect(typeof result).toBe('number');
      expect(result).toBe(1991);
    });

    it('should fetch an object key whose value is an array', () => {
      const result = getObjectKeyValue('$.tags', safeTrack);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toStrictEqual(['pop', 'society']);
    });
  });

  describe('nested object', () => {
    it('should fetch the value of a top-level key', () => {
      const result = getObjectKeyValue('$.album', nestedAlbumObject);

      expect(result).toStrictEqual(nestedAlbumObject.album);
    });

    it('should fetch the value of a key within a nested object', () => {
      const result = getObjectKeyValue('$.album.title', nestedAlbumObject);

      expect(typeof result).toBe('string');
      expect(result).toBe('Bamboo Flute');
    });

    it('should fetch the value of a key within a deeply nested object', () => {
      const result = getObjectKeyValue(
        '$.album.meta.streams.total',
        nestedAlbumObject,
      );

      expect(typeof result).toBe('number');
      expect(result).toBe(2_300_000);
    });
  });

  describe('object key does not exist', () => {
    const nonExistentKey = '$.category';

    it('should use fallback object', () => {
      const fallbackObject = {
        category: 'general',
        trackDuration: '6:25',
      };
      const result = getObjectKeyValue(
        nonExistentKey,
        safeTrack,
        fallbackObject,
      );

      expect(result).toBe('general');
    });

    it('should throw error if no fallback object is provided', () => {
      expect(() => getObjectKeyValue(nonExistentKey, safeTrack)).toThrowError(
        'Object has no category key, and no fallback object was provided',
      );
    });

    it('should return undefined if throwObjectKeyNotFoundError is false', () => {
      const result = getObjectKeyValue(
        nonExistentKey,
        safeTrack,
        undefined,
        false,
      );
      expect(result).toBe(undefined);
    });
  });
});

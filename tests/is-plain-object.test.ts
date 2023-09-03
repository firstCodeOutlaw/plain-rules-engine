import { isPlainObject } from '../src/helpers';

describe('Is plain object', () => {
  it('should return true if value is an object', () => {
    const value = {
      title: 'Heal the World',
      artist: 'Michael Jackson',
      year: 1991,
      album: 'Dangerous',
      tags: ['pop', 'society'],
    };

    expect(isPlainObject(value)).toBe(true);
  });

  it('should return false if value is an array', () => {
    const value = ['an', 'array'];

    expect(isPlainObject(value)).toBe(false);
  });

  it('should return false if value is a string', () => {
    const value = 'string';

    expect(isPlainObject(value)).toBe(false);
  });

  it('should return false if value is a number', () => {
    const value = 1;

    expect(isPlainObject(value)).toBe(false);
  });

  it('should return false if value is null', () => {
    const value = null;

    expect(isPlainObject(value)).toBe(false);
  });

  it('should return false if value is undefined', () => {
    const value = undefined;

    expect(isPlainObject(value)).toBe(false);
  });

  it('should return false if value is a function', () => {
    const value = function (): void {
      console.log('Function was called...');
    };

    expect(isPlainObject(value)).toBe(false);
  });
});

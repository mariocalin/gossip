import { isNullOrUndefined, isNumeric, isValidURL } from './utils';

describe('isNullOrUndefined', () => {
  test('should return true for null', () => {
    expect(isNullOrUndefined(null)).toBe(true);
  });

  test('should return true for undefined', () => {
    expect(isNullOrUndefined(undefined)).toBe(true);
  });

  test('should return false for non-null and non-undefined values', () => {
    expect(isNullOrUndefined('test')).toBe(false);
    expect(isNullOrUndefined(123)).toBe(false);
    expect(isNullOrUndefined({})).toBe(false);
  });
});

describe('isNumeric', () => {
  test('should return true for integer numeric values', () => {
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('-456')).toBe(true);
  });

  test('should return false for non-numeric values', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric('12.34')).toBe(false);
    expect(isNumeric('1e5')).toBe(false);
  });
});

describe('isValidURL', () => {
  it('should return true for a valid URL', () => {
    expect(isValidURL('https://www.example.com')).toBe(true);
    expect(isValidURL('ftp://my-server/file')).toBe(true);
    expect(isValidURL('http://domain.com/path?param=value')).toBe(true);
  });

  it('should return false for an invalid URL', () => {
    expect(isValidURL('invalid-url')).toBe(false);
  });

  it('should return false for an empty string or undefined', () => {
    expect(isValidURL('')).toBe(false);
    expect(isValidURL()).toBe(false);
  });
});

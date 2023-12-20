import { isNullOrUndefined, isNumeric } from './utils';

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

import { Either } from './either';

describe('Either', () => {
  test('should create an instance with Right value', () => {
    const result = Either.right<string, number>(42);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.getOrElse(-1)).toBe(42);
  });

  test('should create an instance with Left value', () => {
    const result = Either.left<string, number>('Error message');

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.getOrElse(-1)).toBe(-1); // Using default value for Left
  });

  test('should map Right values', () => {
    const result = Either.right<string, number>(42).map((value) => value * 2);

    expect(result.isRight()).toBe(true);
    expect(result.getOrElse(-1)).toBe(84);
  });

  test('should not map Left values', () => {
    const result = Either.left<string, number>('Error message').map((value) => value * 2);

    expect(result.isLeft()).toBe(true);
    expect(result.getOrElse(-1)).toBe(-1);
  });

  test('should flatMap Right values', () => {
    const result = Either.right<string, number>(42).flatMap((value) => Either.right(value * 2));

    expect(result.isRight()).toBe(true);
    expect(result.getOrElse(-1)).toBe(84);
  });

  test('should not flatMap Left values', () => {
    const result = Either.left<string, number>('Error message').flatMap((value) => Either.right(value * 2));

    expect(result.isLeft()).toBe(true);
    expect(result.getOrElse(-1)).toBe(-1);
  });

  test('should throw an error with getOrThrow for Left values', () => {
    const result = Either.left<string, number>('Error message');

    expect(() => result.getOrThrow('Custom error message')).toThrow('Custom error message');
  });

  test('should return default value with getOrElse for Left values', () => {
    const result = Either.left<string, number>('Error message');

    expect(result.getOrElse(-1)).toBe(-1);
  });

  test('should execute the consumer function for Right values', () => {
    const result = Either.right<string, number>(42);

    result.ifRight((value) => {
      expect(value).toBe(42);
    });
  });

  test('should throw an error for Left values', () => {
    const result = Either.left<string, number>('Error message');

    expect(() => {
      result.ifRight((_) => {
        throw new Error('This function should not be executed for Left values');
      });
    }).toThrow('Cannot apply right to a left either');
  });

  test('getLeft should get left value if Either is left', () => {
    const value = 'error';
    const eith = Either.left<string, number>(value);
    expect(eith.isLeft()).toBeTruthy();
    expect(eith.getLeft()).toEqual(value);
  });

  test('getLeft should throw an error if Either is right', () => {
    const eith = Either.right<string, number>(42);
    expect(eith.isLeft()).toBeFalsy();
    expect(() => {
      eith.getLeft();
    }).toThrow('Cannot call left in right Either');
  });
});

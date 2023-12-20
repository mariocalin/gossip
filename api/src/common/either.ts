/** NOTICE
 *  This Either type is based on https://xurxodev.com/either-en-typescript/
 */
interface Left<L> {
  kind: 'left';
  leftValue: L;
}
interface Right<R> {
  kind: 'right';
  rightValue: R;
}

type EitherValue<L, R> = Left<L> | Right<R>;

export class Either<L, R> {
  private constructor(private readonly value: EitherValue<L, R>) {}

  isLeft(): boolean {
    return this.value.kind === 'left';
  }

  isRight(): boolean {
    return this.value.kind === 'right';
  }

  fold<T>(leftFn: (left: L) => T, rightFn: (right: R) => T): T {
    switch (this.value.kind) {
      case 'left':
        return leftFn(this.value.leftValue);
      case 'right':
        return rightFn(this.value.rightValue);
    }
  }

  map<T>(fn: (r: R) => T): Either<L, T> {
    return this.flatMap((r) => Either.right(fn(r)));
  }

  flatMap<T>(fn: (right: R) => Either<L, T>): Either<L, T> {
    return this.fold(
      (leftValue) => Either.left(leftValue),
      (rightValue) => fn(rightValue)
    );
  }

  getOrThrow(errorMessage?: string): R {
    const throwFn = (): never => {
      throw new Error(errorMessage ?? 'An error has occurred: ');
    };

    return this.fold(
      () => throwFn(),
      (rightValue) => rightValue
    );
  }

  getOrElse(defaultValue: R): R {
    return this.fold(
      () => defaultValue,
      (someValue) => someValue
    );
  }

  getLeft(): L {
    switch (this.value.kind) {
      case 'left':
        return this.value.leftValue;
      case 'right':
        throw new Error('Cannot call left in right Either');
    }
  }

  ifRight(consumer: (right: R) => void): void {
    const throwFn = (): never => {
      throw new Error('Cannot apply right to a left either');
    };

    this.fold(
      () => throwFn(),
      (value) => {
        consumer(value);
      }
    );
  }

  ifLeft(consumer: (left: L) => void): void {
    const throwFn = (): never => {
      throw new Error('Cannot apply left to a right either');
    };

    this.fold(
      (value) => {
        consumer(value);
      },
      () => throwFn()
    );
  }

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>({ kind: 'left', leftValue: value });
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>({ kind: 'right', rightValue: value });
  }
}

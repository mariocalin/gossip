export type Id = number;

export function provideId(): Id {
  return Date.now();
}

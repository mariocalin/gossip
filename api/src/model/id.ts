export type Id = number;

export function provideId(): Id {
  const randomDigits = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  const timestamp = Date.now();

  return parseInt(`${randomDigits}${timestamp}`);
}

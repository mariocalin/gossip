export type Id = number;

export function provideId(): Id {
  const randomDigits = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const timestamp = Date.now() % 1000000000;

  return parseInt(`${timestamp}${randomDigits}`);
}

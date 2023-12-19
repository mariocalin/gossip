export class ServiceError extends Error {
  constructor(readonly reason: string) {
    super();
  }
}

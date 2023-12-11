export interface DbContext {
  get: (
    query: string,
    params: any[],
    callback: (err: Error | null, row: any) => void
  ) => void;
  all: (
    query: string,
    callback: (err: Error | null, rows: any[]) => void
  ) => void;
  exec: (query: string, callback: (err: Error | null) => void) => void;
  prepare: (query: string) => any;
  destroy: (callback: (err: Error | null) => void) => void;
}

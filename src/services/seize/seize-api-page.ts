export interface SeizeApiPage<T> {
  readonly count: number;
  readonly page: number;
  readonly next: string | null;
  readonly data: T[];
}

export type StepErrorMetadataValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export interface StepErrorLike {
  readonly code?: unknown;
  readonly message?: unknown;
  readonly metadata?: unknown;
  readonly cause?: unknown;
}

export class StepError extends Error {
  readonly code: string;
  readonly metadata?: Record<string, StepErrorMetadataValue>;

  constructor(params: {
    readonly code: string;
    readonly message: string;
    readonly metadata?: Record<string, StepErrorMetadataValue>;
    readonly cause?: unknown;
  }) {
    super(params.message);
    this.name = StepError.name;
    this.code = params.code;
    this.metadata = params.metadata;
    (this as any).cause = params.cause;
  }
}

function isStepErrorMetadataValue(
  value: unknown,
): value is StepErrorMetadataValue {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

export function formatStepErrorMetadata(
  metadata?: Record<string, StepErrorMetadataValue>,
): string {
  if (!metadata) {
    return '';
  }

  const entries = Object.entries(metadata).filter(([, value]) => value !== undefined);
  if (!entries.length) {
    return '';
  }

  return entries
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(', ');
}

export function toStepError(params: {
  readonly code: string;
  readonly message: string;
  readonly metadata?: Record<string, StepErrorMetadataValue>;
  readonly cause?: unknown;
}): StepError {
  return new StepError(params);
}

export function isStepErrorLike(error: unknown): error is StepErrorLike {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as StepErrorLike;
  return (
    typeof candidate.message === 'string' &&
    (candidate.code === undefined || typeof candidate.code === 'string')
  );
}

export function normalizeStepErrorMetadata(
  metadata: unknown,
): Record<string, StepErrorMetadataValue> | undefined {
  if (!metadata || typeof metadata !== 'object') {
    return undefined;
  }

  const normalizedEntries = Object.entries(metadata).filter(([, value]) =>
    isStepErrorMetadataValue(value),
  ) as [string, StepErrorMetadataValue][];

  if (!normalizedEntries.length) {
    return undefined;
  }

  return normalizedEntries.reduce<Record<string, StepErrorMetadataValue>>(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {},
  );
}

export function formatErrorWithCauses(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (!error || typeof error !== 'object') {
    return JSON.stringify(error);
  }

  const candidate = error as StepErrorLike;
  if (typeof candidate.message !== 'string') {
    return JSON.stringify(error);
  }

  const code =
    typeof candidate.code === 'string' && candidate.code.length
      ? `[${candidate.code}] `
      : '';
  const metadata = formatStepErrorMetadata(
    normalizeStepErrorMetadata(candidate.metadata),
  );
  const details = metadata ? ` (${metadata})` : '';
  const cause =
    candidate.cause !== undefined
      ? ` Cause: ${formatErrorWithCauses(candidate.cause)}`
      : '';

  return `${code}${candidate.message}${details}${cause}`;
}

export const REQUIRED_ERROR = '[REQUIRED]';

export const INVALID_TYPE_ERROR = '[INVALID_TYPE]';

export const MIN_ERROR = (min: number) => `[MIN:${min}]`;

export const MAX_ERROR = (max: number) => `[MAX:${max}]`;

export const LENGTH_ERROR = (min: number, max: number) =>
  `[LENGTH:${min}-${max}]`;

export const UUID_ERROR = '[UUID]';

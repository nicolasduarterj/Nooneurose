import { isDate } from 'jet-validators';
import { transform } from 'jet-validators/utils';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Convert to date object then check is a validate date.
 */
export const transformIsDate = transform(
  (arg) => new Date(arg as string),
  (arg) => isDate(arg),
);

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isStringInRange(
  value: unknown,
  min: number,
  max: number
): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length >= min &&
    value.trim().length <= max
  );
}

export function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}
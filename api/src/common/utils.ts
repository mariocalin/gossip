import { isNull, isUndefined, parseInt } from 'lodash';

export function isNullOrUndefined(value: any): boolean {
  return isNull(value) || isUndefined(value);
}

export function isNumeric(value: string): boolean {
  const intValue = parseInt(value, 10);
  return !isNaN(intValue) && isFinite(intValue) && intValue.toString() === value.trim();
}

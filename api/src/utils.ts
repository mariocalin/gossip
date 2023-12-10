import { isNull, isUndefined } from 'lodash';

export function isNullOrUndefined(value: any): boolean {
  return isNull(value) || isUndefined(value);
}

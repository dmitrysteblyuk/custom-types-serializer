import {numberType} from './types';

export const numberSerializer = numberType.createSerializer(
  (x): x is number =>
    typeof x === 'number' && (!Number.isFinite(x) || Object.is(x, -0)),
  (num) => (Object.is(num, -0) ? '-0' : num.toString()),
);

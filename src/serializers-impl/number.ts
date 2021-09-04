import {Serializer} from '../serializer';

export const numberSerializer = Serializer.create(
  'Number',
  (x): x is number =>
    typeof x === 'number' && (!Number.isFinite(x) || Object.is(x, -0)),
  (num) => (Object.is(num, -0) ? '-0' : num.toString()),
  Number,
);

import {Serializer} from '../serializer';

export const setSerializer = Serializer.create(
  'Set',
  (x): x is Set<unknown> =>
    Object.prototype.toString.call(x) === '[object Set]',
  (set) => [...set],
  (values) => new Set(values),
);

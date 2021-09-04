import {Serializer} from '../serializer';

export const mapSerializer = Serializer.create(
  'Map',
  (x): x is Map<unknown, unknown> =>
    Object.prototype.toString.call(x) === '[object Map]',
  (map) => [...map],
  (entries) => new Map(entries),
);

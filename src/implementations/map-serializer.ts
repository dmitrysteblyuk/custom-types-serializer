import {mapType} from './types';

export const mapSerializer = mapType.createSerializer(
  (x): x is Map<unknown, unknown> =>
    Object.prototype.toString.call(x) === '[object Map]',
  (map) => [...map],
);

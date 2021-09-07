import {mapType} from './types';

export const mapReplacer = mapType.createReplacer(
  (x): x is Map<unknown, unknown> =>
    Object.prototype.toString.call(x) === '[object Map]',
  (map) => [...map],
);

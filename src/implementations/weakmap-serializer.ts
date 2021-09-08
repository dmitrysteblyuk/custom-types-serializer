import {weakmapType} from './types';

export const weakmapSerializer = weakmapType.createSerializer(
  (x): x is WeakMap<object, unknown> =>
    Object.prototype.toString.call(x) === '[object WeakMap]',
  () => null,
);

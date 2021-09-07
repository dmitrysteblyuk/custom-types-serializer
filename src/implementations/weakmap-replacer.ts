import {weakmapType} from './types';

export const weakmapReplacer = weakmapType.createReplacer(
  (x): x is WeakMap<object, unknown> =>
    Object.prototype.toString.call(x) === '[object WeakMap]',
  () => null,
);

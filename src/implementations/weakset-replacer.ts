import {weaksetType} from './types';

export const weaksetReplacer = weaksetType.createReplacer(
  (x): x is WeakSet<object> =>
    Object.prototype.toString.call(x) === '[object WeakSet]',
  () => null,
);

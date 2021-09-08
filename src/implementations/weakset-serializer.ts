import {weaksetType} from './types';

export const weaksetSerializer = weaksetType.createSerializer(
  (x): x is WeakSet<object> =>
    Object.prototype.toString.call(x) === '[object WeakSet]',
  () => null,
);

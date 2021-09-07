import {setType} from './types';

export const setReplacer = setType.createReplacer(
  (x): x is Set<unknown> =>
    Object.prototype.toString.call(x) === '[object Set]',
  (set) => [...set],
);

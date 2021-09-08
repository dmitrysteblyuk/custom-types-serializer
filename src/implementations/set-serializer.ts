import {setType} from './types';

export const setSerializer = setType.createSerializer(
  (x): x is Set<unknown> =>
    Object.prototype.toString.call(x) === '[object Set]',
  (set) => [...set],
);

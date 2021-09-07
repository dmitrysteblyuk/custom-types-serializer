import {regexpType} from './types';

export const regexpReplacer = regexpType.createReplacer(
  (value): value is RegExp =>
    Object.prototype.toString.call(value) === '[object RegExp]',
  ({source, flags}) => ({source, flags}),
);

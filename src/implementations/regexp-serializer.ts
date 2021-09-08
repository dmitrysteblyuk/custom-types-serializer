import {regexpType} from './types';

export const regexpSerializer = regexpType.createSerializer(
  (value): value is RegExp =>
    Object.prototype.toString.call(value) === '[object RegExp]',
  ({source, flags}) => ({source, flags}),
);

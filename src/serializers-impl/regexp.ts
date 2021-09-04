import {Serializer} from '../serializer';

export const regexpSerializer = Serializer.create(
  'RegExp',
  (value): value is RegExp =>
    Object.prototype.toString.call(value) === '[object RegExp]',
  ({source, flags}) => ({source, flags}),
  ({source, flags}) => new RegExp(source, flags),
);

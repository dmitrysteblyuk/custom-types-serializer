import {Serializer} from '../serializer';

export const weakmapSerializer = Serializer.create(
  'WeakMap',
  (x) => Object.prototype.toString.call(x) === '[object WeakMap]',
  () => null,
  () => new WeakMap(),
);

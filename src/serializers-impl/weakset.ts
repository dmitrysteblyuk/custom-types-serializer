import {Serializer} from '../serializer';

export const weaksetSerializer = Serializer.create(
  'WeakSet',
  (x) => Object.prototype.toString.call(x) === '[object WeakSet]',
  () => null,
  () => new WeakSet(),
);

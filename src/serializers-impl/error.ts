import {Serializer} from '../serializer';

export const errorSerializer = Serializer.create(
  'Error',
  (x): x is Error => Object.prototype.toString.call(x) === '[object Error]',
  ({message, stack = message}) => stack,
  Error,
);

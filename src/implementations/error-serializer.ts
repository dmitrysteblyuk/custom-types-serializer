import {errorType} from './types';

export const errorSerializer = errorType.createSerializer(
  (x): x is Error => Object.prototype.toString.call(x) === '[object Error]',
  ({message, stack = message}) => stack,
);

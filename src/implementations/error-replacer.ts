import {errorType} from './types';

export const errorReplacer = errorType.createReplacer(
  (x): x is Error => Object.prototype.toString.call(x) === '[object Error]',
  ({message, stack = message}) => stack,
);

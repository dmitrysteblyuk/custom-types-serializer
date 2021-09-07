import {identity} from '../utils';
import {dateType} from './types';

export const dateReplacer = dateType.createReplacer(
  (_value, {original}): _value is string =>
    Object.prototype.toString.call(original) === '[object Date]',
  identity,
);

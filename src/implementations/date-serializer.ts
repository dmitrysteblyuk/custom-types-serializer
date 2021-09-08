import {identity} from '../utils';
import {dateType} from './types';

export const dateSerializer = dateType.createSerializer(
  (_value, {original}): _value is string =>
    Object.prototype.toString.call(original) === '[object Date]',
  identity,
);

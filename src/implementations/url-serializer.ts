import {identity} from '../utils';
import {urlType} from './types';

export const urlSerializer = urlType.createSerializer(
  (_value, {original}): _value is string =>
    Object.prototype.toString.call(original) === '[object URL]',
  identity,
);

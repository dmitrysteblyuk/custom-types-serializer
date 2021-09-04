import {Serializer} from '../serializer';
import {identity} from '../utils';

export const dateSerializer = Serializer.create(
  'Date',
  (_, {parent, key}) =>
    Object.prototype.toString.call(parent[key]) === '[object Date]',
  identity,
  (isoString) => new Date(isoString as string),
);

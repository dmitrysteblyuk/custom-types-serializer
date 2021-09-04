import {Serializer} from '../serializer';
import {identity} from '../utils';

export const urlSerializer = Serializer.create(
  'URL',
  (_, {parent, key}) =>
    Object.prototype.toString.call(parent[key]) === '[object URL]',
  identity,
  (href) => new URL(href as string),
);

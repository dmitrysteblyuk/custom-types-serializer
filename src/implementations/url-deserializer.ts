import {urlType} from './types';

export const urlDeserializer = urlType.createDeserializer(
  (href) => new URL(href),
);

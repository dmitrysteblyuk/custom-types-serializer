import {mapType} from './types';

export const mapDeserializer = mapType.createDeserializer(
  (entries) => new Map(entries),
);

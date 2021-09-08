import {regexpType} from './types';

export const regexpDeserializer = regexpType.createDeserializer(
  ({source, flags}) => new RegExp(source, flags),
);

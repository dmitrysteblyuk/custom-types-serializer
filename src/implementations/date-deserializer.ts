import {dateType} from './types';

export const dateDeserializer = dateType.createDeserializer(
  (isoString) => new Date(isoString),
);

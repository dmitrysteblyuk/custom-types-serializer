import {undefinedType} from './types';

export const undefinedDeserializer = undefinedType.createDeserializer(
  () => undefined,
);

import {setType} from './types';

export const setDeserializer = setType.createDeserializer(
  (values) => new Set(values),
);

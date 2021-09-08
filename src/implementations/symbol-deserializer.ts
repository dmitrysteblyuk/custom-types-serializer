import {symbolType} from './types';

export const symbolDeserializer = symbolType.createDeserializer((description) =>
  description === null ? Symbol() : Symbol(description),
);

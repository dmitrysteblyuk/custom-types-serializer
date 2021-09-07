import {symbolType} from './types';

export const symbolReviver = symbolType.createReviver((description) =>
  description === null ? Symbol() : Symbol(description),
);

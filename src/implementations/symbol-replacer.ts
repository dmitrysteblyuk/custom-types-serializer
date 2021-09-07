import {symbolType} from './types';

export const symbolReplacer = symbolType.createReplacer(
  (x): x is symbol => typeof x === 'symbol',
  ({description = null}) => description,
);

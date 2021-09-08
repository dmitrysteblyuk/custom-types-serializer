import {symbolType} from './types';

export const symbolSerializer = symbolType.createSerializer(
  (x): x is symbol => typeof x === 'symbol',
  ({description = null}) => description,
);

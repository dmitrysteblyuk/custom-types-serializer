import {bigintType} from './types';

export const bigintReplacer = bigintType.createReplacer(
  (x): x is bigint => typeof x === 'bigint',
  String,
);

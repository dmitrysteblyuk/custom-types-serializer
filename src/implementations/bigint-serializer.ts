import {bigintType} from './types';

export const bigintSerializer = bigintType.createSerializer(
  (x): x is bigint => typeof x === 'bigint',
  String,
);

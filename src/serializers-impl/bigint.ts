import {Serializer} from '../serializer';

export const bigintSerializer = Serializer.create(
  'BigInt',
  (x): x is bigint => typeof x === 'bigint',
  String,
  BigInt,
);

import {bigintType} from './types';

export const bigintReviver = bigintType.createReviver(BigInt);

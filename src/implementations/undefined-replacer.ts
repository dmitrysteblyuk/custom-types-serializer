import {undefinedType} from './types';

export const undefinedReplacer = undefinedType.createReplacer(
  (x): x is undefined => x === undefined,
  () => null,
);

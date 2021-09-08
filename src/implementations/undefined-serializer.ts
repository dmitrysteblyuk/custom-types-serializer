import {undefinedType} from './types';

export const undefinedSerializer = undefinedType.createSerializer(
  (x): x is undefined => x === undefined,
  () => null,
);

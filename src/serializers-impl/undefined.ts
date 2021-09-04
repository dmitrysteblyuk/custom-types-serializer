import {Serializer} from '../serializer';

export const undefinedSerializer = Serializer.create(
  'Undefined',
  (x) => x === undefined,
  () => null,
  () => undefined,
);

import {Serializer} from '../serializer';

export const symbolSerializer = Serializer.create(
  'Symbol',
  (x): x is symbol => typeof x === 'symbol',
  ({description}) => description,
  Symbol,
);

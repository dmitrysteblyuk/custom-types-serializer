import {regexpType} from './types';

export const regexpReviver = regexpType.createReviver(
  ({source, flags}) => new RegExp(source, flags),
);

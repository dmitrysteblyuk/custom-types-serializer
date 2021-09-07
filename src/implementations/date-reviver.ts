import {dateType} from './types';

export const dateReviver = dateType.createReviver(
  (isoString) => new Date(isoString),
);

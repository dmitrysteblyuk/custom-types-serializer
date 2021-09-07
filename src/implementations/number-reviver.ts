import {numberType} from './types';

export const numberReviver = numberType.createReviver(Number);

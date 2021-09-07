import {setType} from './types';

export const setReviver = setType.createReviver((values) => new Set(values));

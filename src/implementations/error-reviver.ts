import {errorType} from './types';

export const errorReviver = errorType.createReviver(Error);

import {weaksetType} from './types';

export const weaksetReviver = weaksetType.createReviver(() => new WeakSet());

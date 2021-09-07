import {weakmapType} from './types';

export const weakmapReviver = weakmapType.createReviver(() => new WeakMap());

import {undefinedType} from './types';

export const undefinedReviver = undefinedType.createReviver(() => undefined);

import {urlType} from './types';

export const urlReviver = urlType.createReviver((href) => new URL(href));

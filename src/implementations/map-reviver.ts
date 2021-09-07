import {mapType} from './types';

export const mapReviver = mapType.createReviver((entries) => new Map(entries));

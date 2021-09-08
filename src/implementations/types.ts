import {customType} from '../custom-type';
import type {Reference} from './reference-serializer';

export const bigintType = customType<string>('BigInt');
export const dateType = customType<string>('Date');
export const errorType = customType<string>('Error');
export const undefinedType = customType<null>('Undefined');
export const urlType = customType<string>('URL');
export const regexpType = customType<{source: string; flags: string}>('RegExp');
export const numberType = customType<string>('Number');
export const symbolType = customType<string | null>('Symbol');
export const mapType = customType<[unknown, unknown][]>('Map');
export const setType = customType<unknown[]>('Set');
export const weakmapType = customType<null>('WeakMap');
export const weaksetType = customType<null>('WeakSet');
export const referenceType = customType<number | Reference>('Reference');

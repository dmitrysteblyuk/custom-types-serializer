import {Deserializer} from '../deserializer';
import {undefinedDeserializer} from './undefined-deserializer';
import {numberDeserializer} from './number-deserializer';
import {bigintDeserializer} from './bigint-deserializer';
import {symbolDeserializer} from './symbol-deserializer';
import {dateDeserializer} from './date-deserializer';
import {urlDeserializer} from './url-deserializer';
import {errorDeserializer} from './error-deserializer';
import {regexpDeserializer} from './regexp-deserializer';
import {setDeserializer} from './set-deserializer';
import {mapDeserializer} from './map-deserializer';
import {weakmapDeserializer} from './weakmap-deserializer';
import {weaksetDeserializer} from './weakset-deserializer';

export const jsDeserializer = Deserializer.combine(
  undefinedDeserializer,
  numberDeserializer,
  bigintDeserializer,
  symbolDeserializer,
  dateDeserializer,
  urlDeserializer,
  errorDeserializer,
  regexpDeserializer,
  setDeserializer,
  mapDeserializer,
  weakmapDeserializer,
  weaksetDeserializer,
);

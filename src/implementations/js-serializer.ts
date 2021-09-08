import {Serializer} from '../serializer';
import {undefinedSerializer} from './undefined-serializer';
import {numberSerializer} from './number-serializer';
import {bigintSerializer} from './bigint-serializer';
import {symbolSerializer} from './symbol-serializer';
import {dateSerializer} from './date-serializer';
import {urlSerializer} from './url-serializer';
import {errorSerializer} from './error-serializer';
import {regexpSerializer} from './regexp-serializer';
import {setSerializer} from './set-serializer';
import {mapSerializer} from './map-serializer';
import {weakmapSerializer} from './weakmap-serializer';
import {weaksetSerializer} from './weakset-serializer';

export const jsSerializer = Serializer.combine(
  undefinedSerializer,
  numberSerializer,
  bigintSerializer,
  symbolSerializer,
  dateSerializer,
  urlSerializer,
  errorSerializer,
  regexpSerializer,
  setSerializer,
  mapSerializer,
  weakmapSerializer,
  weaksetSerializer,
);

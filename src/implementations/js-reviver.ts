import {Reviver} from '../reviver';
import {undefinedReviver} from './undefined-reviver';
import {numberReviver} from './number-reviver';
import {bigintReviver} from './bigint-reviver';
import {symbolReviver} from './symbol-reviver';
import {dateReviver} from './date-reviver';
import {urlReviver} from './url-reviver';
import {errorReviver} from './error-reviver';
import {regexpReviver} from './regexp-reviver';
import {setReviver} from './set-reviver';
import {mapReviver} from './map-reviver';
import {weakmapReviver} from './weakmap-reviver';
import {weaksetReviver} from './weakset-reviver';

export const jsReviver = Reviver.combine(
  undefinedReviver,
  numberReviver,
  bigintReviver,
  symbolReviver,
  dateReviver,
  urlReviver,
  errorReviver,
  regexpReviver,
  setReviver,
  mapReviver,
  weakmapReviver,
  weaksetReviver,
);

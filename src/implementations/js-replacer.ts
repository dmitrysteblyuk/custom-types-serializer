import {Replacer} from '../replacer';
import {undefinedReplacer} from './undefined-replacer';
import {numberReplacer} from './number-replacer';
import {bigintReplacer} from './bigint-replacer';
import {symbolReplacer} from './symbol-replacer';
import {dateReplacer} from './date-replacer';
import {urlReplacer} from './url-replacer';
import {errorReplacer} from './error-replacer';
import {regexpReplacer} from './regexp-replacer';
import {setReplacer} from './set-replacer';
import {mapReplacer} from './map-replacer';
import {weakmapReplacer} from './weakmap-replacer';
import {weaksetReplacer} from './weakset-replacer';

export const jsReplacer = Replacer.combine(
  undefinedReplacer,
  numberReplacer,
  bigintReplacer,
  symbolReplacer,
  dateReplacer,
  urlReplacer,
  errorReplacer,
  regexpReplacer,
  setReplacer,
  mapReplacer,
  weakmapReplacer,
  weaksetReplacer,
);

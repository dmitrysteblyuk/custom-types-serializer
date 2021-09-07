import {describe, it, expect} from '@jest/globals';
import * as api from '.';

describe('exports', () => {
  it('should export required api', () => {
    expect(api).toMatchInlineSnapshot(`
Object {
  "AbstractCoreModule": [Function],
  "CoreModule": [Function],
  "Replacer": [Function],
  "Reviver": [Function],
  "bigintReplacer": TypedReplacer {},
  "bigintReviver": TypedReviver {},
  "customType": [Function],
  "dateReplacer": TypedReplacer {},
  "dateReviver": TypedReviver {},
  "defaultCoreModule": CoreModule {},
  "errorReplacer": TypedReplacer {},
  "errorReviver": TypedReviver {},
  "jsReplacer": CombinedReplacer {},
  "jsReviver": CombinedReviver {},
  "mapReplacer": TypedReplacer {},
  "mapReviver": TypedReviver {},
  "numberReplacer": TypedReplacer {},
  "numberReviver": TypedReviver {},
  "referenceReplacer": TypedReplacer {},
  "referenceReviver": TypedReviver {},
  "regexpReplacer": TypedReplacer {},
  "regexpReviver": TypedReviver {},
  "setReplacer": TypedReplacer {},
  "setReviver": TypedReviver {},
  "symbolReplacer": TypedReplacer {},
  "symbolReviver": TypedReviver {},
  "undefinedReplacer": TypedReplacer {},
  "undefinedReviver": TypedReviver {},
  "urlReplacer": TypedReplacer {},
  "urlReviver": TypedReviver {},
  "weakmapReplacer": TypedReplacer {},
  "weakmapReviver": TypedReviver {},
  "weaksetReplacer": TypedReplacer {},
  "weaksetReviver": TypedReviver {},
}
`);
  });
});

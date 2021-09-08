import {describe, it, expect} from '@jest/globals';
import * as api from '.';

describe('exports', () => {
  it('should export correct api', () => {
    expect(api).toMatchInlineSnapshot(`
Object {
  "AbstractCoreModule": [Function],
  "CoreModule": [Function],
  "Deserializer": [Function],
  "Serializer": [Function],
  "bigintDeserializer": TypedDeserializer {},
  "bigintSerializer": TypedSerializer {},
  "customType": [Function],
  "dateDeserializer": TypedDeserializer {},
  "dateSerializer": TypedSerializer {},
  "defaultCoreModule": CoreModule {},
  "errorDeserializer": TypedDeserializer {},
  "errorSerializer": TypedSerializer {},
  "jsDeserializer": CombinedDeserializer {},
  "jsSerializer": CombinedSerializer {},
  "mapDeserializer": TypedDeserializer {},
  "mapSerializer": TypedSerializer {},
  "numberDeserializer": TypedDeserializer {},
  "numberSerializer": TypedSerializer {},
  "referenceDeserializer": TypedDeserializer {},
  "referenceSerializer": TypedSerializer {},
  "regexpDeserializer": TypedDeserializer {},
  "regexpSerializer": TypedSerializer {},
  "setDeserializer": TypedDeserializer {},
  "setSerializer": TypedSerializer {},
  "symbolDeserializer": TypedDeserializer {},
  "symbolSerializer": TypedSerializer {},
  "undefinedDeserializer": TypedDeserializer {},
  "undefinedSerializer": TypedSerializer {},
  "urlDeserializer": TypedDeserializer {},
  "urlSerializer": TypedSerializer {},
  "weakmapDeserializer": TypedDeserializer {},
  "weakmapSerializer": TypedSerializer {},
  "weaksetDeserializer": TypedDeserializer {},
  "weaksetSerializer": TypedSerializer {},
}
`);
  });
});

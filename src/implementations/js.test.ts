import {describe, it, expect} from '@jest/globals';
import {jsSerializer} from './js-serializer';
import {jsDeserializer} from './js-deserializer';

describe('jsSerializer', () => {
  it('serializes most js types', () => {
    const comparable = {
      numbers: [123, 0, -0, NaN, Infinity, -Infinity],
      dates: [new Date(), new Date(1234567890)],
      urls: [new URL('https://localhost:8080?a=b&b=c#test')],
      regexp: /^(?=.)\.$/m,
      set: new Set([{a: 123}, {b: 'abc'}]),
      map: new Map([
        ['a', 1],
        ['b', 2],
      ]),
      bigints: [123456789012345678901234567890123456789012345678901234567890n],
      weakmap: new WeakMap([[{}, 2]]),
      weakset: new WeakSet([{}]),
    };
    const value = {
      ...comparable,
      nones: [null, undefined],
      error: new ReferenceError('Something went wrong.'),
      symbol: Symbol('my-symbol'),
    };
    const serialized = JSON.stringify(value, jsSerializer.getReplacer());
    const {error, symbol, nones, ...deserialized}: typeof value = JSON.parse(
      serialized,
      jsDeserializer.getReviver(),
    );

    expect(deserialized).toStrictEqual(comparable);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('ReferenceError: Something went wrong.');
    expect(typeof symbol).toBe('symbol');
    expect(symbol.description).toBe('my-symbol');
    expect(nones).toStrictEqual([null, ,]);
  });

  it('should work for the example from Readme', () => {
    const data = {
      error: new Error('Something went wrong.'),
      symbol: Symbol('test'),
      set: new Set([
        new Date(1234567890),
        undefined,
        NaN,
        -0,
        123n,
        /^(?=abc).*$/g,
      ]),
    };
    const serialized = JSON.stringify(data, jsSerializer.getReplacer());
    const deserialized: typeof data = JSON.parse(
      serialized,
      jsDeserializer.getReviver(),
    );

    expect(([...deserialized.set.values()][0] as Date).getTime()).toBe(
      1234567890,
    );
    expect(deserialized.set).toStrictEqual(data.set);
  });
});

import {describe, it, expect} from '@jest/globals';
import {defaultCoreModule} from './core-default';

describe('customType()', () => {
  it('should return a correct type', () => {
    expect(
      defaultCoreModule.getCustomTypeAndValue(
        defaultCoreModule.createCustomType('my-type', 123),
      ),
    ).toEqual({type: 'my-type', value: 123});
  });

  it('should not be a custom type', () => {
    expect(
      defaultCoreModule.isCustomType(['fake-type', 'abc', 'fake-secret']),
    ).toBe(false);
  });
});

describe('.createReplacer()/.createReviver()', () => {
  it('should serialize any custom type', () => {
    const value = {
      date: new Date(1234567890),
      url: new URL('http://localhost:8080#test'),
      array: [
        0,
        NaN,
        -Infinity,
        Infinity,
        123n,
        true,
        new Date(),
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      ],
    };

    const serialized = JSON.stringify(
      value,
      defaultCoreModule.createReplacer((value, typed, {original}) => {
        if (original instanceof Date) {
          return typed('Date', value as string);
        }
        if (original instanceof URL) {
          return typed('URL', value as string);
        }
        if (typeof value === 'bigint') {
          return typed('BigInt', value.toString());
        }
        if (value instanceof Map) {
          return typed('Map', [...value]);
        }
        if (typeof value === 'number' && !Number.isFinite(value)) {
          return typed('Number', value.toString());
        }
        return value;
      }),
    );
    const deserialzed = JSON.parse(
      serialized,
      defaultCoreModule.createReviver((value: any, type) => {
        if (type === 'Date') {
          return new Date(value);
        }
        if (type === 'URL') {
          return new URL(value);
        }
        if (type === 'BigInt') {
          return BigInt(value);
        }
        if (type === 'Map') {
          return new Map(value);
        }
        if (type === 'Number') {
          return Number(value);
        }
        return value;
      }),
    );
    expect(deserialzed).toStrictEqual(value);
  });

  it('should serialize symbols', () => {
    const callCount = [0, 0];
    const serialized = JSON.stringify(
      Symbol('my-symbol'),
      defaultCoreModule.createReplacer((value, typed) => {
        callCount[0]++;
        if (typeof value === 'symbol') {
          const {description = null} = value;
          return typed('Symbol', description);
        }
        return value;
      }),
    );
    const deserialzed: symbol = JSON.parse(
      serialized,
      defaultCoreModule.createReviver((value: any, type) => {
        callCount[1]++;
        if (type === 'Symbol') {
          return Symbol(value ?? undefined);
        }
        return value;
      }),
    );
    expect(typeof deserialzed).toBe('symbol');
    expect(deserialzed.description).toBe('my-symbol');
    expect(callCount).toEqual([1, 1]);
  });
});

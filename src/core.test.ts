import {describe, it, expect} from '@jest/globals';
import {
  UNSAFE_resetCustomTypeSecret,
  getCustomType,
  createReplacer,
  createReviver,
  customType,
} from './core';

describe('customType()', () => {
  it('should return a correct type', () => {
    expect(getCustomType(customType('my-type', 123))).toBe('my-type');
  });

  it('should fail to create an invalid tyoe', () => {
    expect(() => customType(1 as any, 123)).toThrowError(
      new Error(`Custom type id must be a string. Received: "1".`),
    );
  });

  it('should not have a custom type', () => {
    try {
      expect(getCustomType(['fake-type', 'abc', 'fake-secret'])).toBeNull();
      UNSAFE_resetCustomTypeSecret('mock-secret');
      expect(getCustomType([null, 123, 'mock-secret'])).toBeNull();
      expect(getCustomType(['correct-type', 123, 'mock-secret'])).toBe(
        'correct-type',
      );
    } finally {
      UNSAFE_resetCustomTypeSecret();
    }
  });
});

describe('createReplacer()/createReviver()', () => {
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
      createReplacer((value, {parent, key}) => {
        if (parent[key] instanceof Date) {
          return customType('Date', value);
        }
        if (parent[key] instanceof URL) {
          return customType('URL', value);
        }
        if (typeof value === 'bigint') {
          return customType('BigInt', value.toString());
        }
        if (value instanceof Map) {
          return customType('Map', [...value]);
        }
        if (typeof value === 'number' && !Number.isFinite(value)) {
          return customType('NonSerializableNumber', value.toString());
        }
        return value;
      }),
    );
    const deserialzed = JSON.parse(
      serialized,
      createReviver((value: any, type) => {
        switch (type) {
          case 'Date':
            return new Date(value);
          case 'URL':
            return new URL(value);
          case 'BigInt':
            return BigInt(value);
          case 'Map':
            return new Map(value);
          case 'NonSerializableNumber':
            return Number(value);
        }
        return value;
      }),
    );
    expect(deserialzed).toStrictEqual(value);
  });

  it('should serialize symbols', () => {
    const serialized = JSON.stringify(
      Symbol('my-symbol'),
      createReplacer((value) => {
        if (typeof value === 'symbol') {
          return customType('Symbol', value.description);
        }
        return value;
      }),
    );
    const deserialzed: symbol = JSON.parse(
      serialized,
      createReviver((value, type) => {
        if (type === 'Symbol') {
          return Symbol(value as string);
        }
        return value;
      }),
    );
    expect(typeof deserialzed).toBe('symbol');
    expect(deserialzed.description).toBe('my-symbol');
  });

  it('should work for `.toJSON()`', () => {
    class MyClass {
      state = {any: 'value'};
      subClasses = [...new Array(10)].map(
        (_, index) => new MySubClass(String(index)),
      );
      toJSON() {
        return customType('MyClass', {...this});
      }
    }
    class MySubClass {
      state = {data: [Math.random()]};
      constructor(readonly id: string) {}
      toJSON() {
        return customType('MySubClass', {...this});
      }
    }
    const instance = new MyClass();
    const serialized = JSON.stringify(instance);
    const exactCopy = JSON.parse(
      serialized,
      createReviver((value, type) => {
        if (type === 'MyClass') {
          return Object.assign(new MyClass(), value);
        }
        if (type === 'MySubClass') {
          return Object.assign(new MySubClass(''), value);
        }
        return value;
      }),
    );

    expect(exactCopy).toStrictEqual(instance);

    const jsonCopy = JSON.parse(serialized, createReviver());
    expect(jsonCopy).toStrictEqual({
      ...instance,
      subClasses: instance.subClasses.map((sub) => ({...sub})),
    });
  });
});

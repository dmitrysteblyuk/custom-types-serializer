import type {
  SerializerCallback,
  DeserializerCallback,
  WrapWithType,
} from './types';
import {assertIsNonEmptyString} from './utils';

type UnknownObject = Readonly<Record<string, unknown>>;

const FIRST_CHAR = '`' as const;
const LAST_CHAR = '~' as const;
type CustomTypeJson<T> = readonly [
  type: `${typeof FIRST_CHAR}${string}${typeof LAST_CHAR}`,
  value: T,
];

class CustomType<T> extends Array {
  static create<T>(type: string, value: T) {
    return new CustomType(type, value);
  }
  static isLike<T>(value: unknown): value is CustomTypeJson<T> {
    if (!(Array.isArray(value) && value.length === 2)) {
      return false;
    }
    const [type] = value;
    return (
      typeof type === 'string' &&
      type.length > 1 &&
      type[0] === FIRST_CHAR &&
      type[type.length - 1] === LAST_CHAR
    );
  }
  static is<T>(value: unknown): value is CustomType<T> {
    return value instanceof CustomType;
  }

  private constructor(id: string, value: T) {
    super(
      `${FIRST_CHAR}${id}${LAST_CHAR}`,
      // @ts-ignore
      value,
    );
  }
}

function createReplacer(callback: SerializerCallback) {
  return function (this: UnknownObject, key: string, value: unknown) {
    if (CustomType.is(value) || CustomType.is(this)) {
      return value;
    }
    const result = callback(value, CustomType.create, {
      parentObject: this,
      key,
      original: this[key],
    });

    if (!CustomType.is(result) && CustomType.isLike(result)) {
      const type = callback(result[0], CustomType.create, {
        parentObject: result,
        key: '0',
        original: result[0],
      });
      return [CustomType.create('', type), result[1]];
    }
    return result;
  };
}

function createReviver(callback: DeserializerCallback) {
  return function (this: UnknownObject, key: string, json: unknown) {
    if (CustomType.isLike(this)) {
      return json;
    }
    let type: string | null = null;
    let value: unknown;

    if (CustomType.isLike(json)) {
      [type, value] = json;
      type = type.length === 2 ? null : type.slice(1, -1);
    } else {
      value = json;
    }
    return callback(value, type, {parentObject: this, key});
  };
}

const serialized = JSON.stringify(
  {
    date: new Date(),
    tuples: [['`Date~', 123], ['`dewe~', 'dew', 'cds'], ['`~'], ['`~', 12]],
  },
  createReplacer((value, typed, {original, key, parentObject}) => {
    0 && console.log(value, original, key, parentObject);
    if (original instanceof Date) {
      return typed('Date', value);
    }
    return value;
  }),
);
console.log(serialized);
const deserialized = JSON.parse(
  serialized,
  createReviver((value, type) => {
    return type === 'Date' ? new Date(value) : value;
  }),
);
console.log(deserialized);

export abstract class AbstractCoreModule<T> {
  readonly #wrapWithType: WrapWithType = (type, value) => {
    return this.createCustomType(type, value);
  };
  abstract createCustomType(type: string, value: unknown): T;
  abstract isCustomType(value: unknown): value is T;
  abstract getCustomTypeAndValue(value: T): {type: string; value: unknown};

  createReplacer(callback: SerializerCallback) {
    const typed = this.#wrapWithType;
    const self = this;

    return function (this: object, key: string, value: unknown) {
      if (self.isCustomType(value) || self.isCustomType(this)) {
        return value;
      }
      const parentObject = this;
      const original = (parentObject as any)[key];
      return callback(value, typed, {parentObject, key, original});
    };
  }

  createReviver(callback: DeserializerCallback) {
    const self = this;
    return function (this: object, key: string, json: unknown) {
      if (self.isCustomType(this)) {
        return json;
      }
      let type: string | null = null;
      let value: unknown;

      if (self.isCustomType(json)) {
        ({type, value} = self.getCustomTypeAndValue(json));
      } else {
        value = json;
      }
      return callback(value, type, {parentObject: this, key});
    };
  }
}

type CustomTypeArray = readonly [id: string, value: unknown, secret: string];

export class CoreModule extends AbstractCoreModule<CustomTypeArray> {
  readonly #secret;

  constructor(secret: string) {
    assertIsNonEmptyString(secret, 'Custom type secret');
    super();
    this.#secret = secret;
  }

  createCustomType(type: string, value: unknown) {
    return [type, value, this.#secret] as const;
  }

  isCustomType(value: unknown): value is CustomTypeArray {
    return (
      Array.isArray(value) &&
      value.length === 3 &&
      typeof value[0] === 'string' &&
      value[2] === this.#secret
    );
  }

  getCustomTypeAndValue([type, value]: CustomTypeArray) {
    return {type, value};
  }
}

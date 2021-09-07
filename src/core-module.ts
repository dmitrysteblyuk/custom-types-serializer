import type {ReplacerCallback, ReviverCallback, WrapWithType} from './types';
import {assertIsNonEmptyString} from './utils';

export abstract class AbstractCoreModule<T> {
  readonly #wrapWithType: WrapWithType = (type, value) => {
    return this.createCustomType(type, value);
  };
  abstract createCustomType(type: string, value: unknown): T;
  abstract isCustomType(value: unknown): value is T;
  abstract getCustomTypeAndValue(value: T): {type: string; value: unknown};

  createReplacerCallback(callback: ReplacerCallback) {
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

  createReviverCallback(callback: ReviverCallback) {
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

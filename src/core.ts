import type {
  JsonCallback,
  ReplacerCallback,
  ReviverCallback,
  SerializerReplacer,
  SerializerReviver,
} from './types';
import {assertOfType, identity} from './utils';

type CustomType<T> = readonly [id: string, value: T, secret: string];

const DEFAULT_CUSTOM_TYPE_SECRET =
  '__CUSTOM_TYPES_SERIALIZER_SECRET_DO_NOT_USE__';
let customTypeSecret = DEFAULT_CUSTOM_TYPE_SECRET;

export function UNSAFE_resetCustomTypeSecret(
  newSecret = DEFAULT_CUSTOM_TYPE_SECRET,
) {
  assertOfType(newSecret, 'string', 'Custom type secret');
  customTypeSecret = newSecret;
}

function isCustomType<T>(value: unknown): value is CustomType<T> {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    typeof value[0] === 'string' &&
    value[2] === customTypeSecret
  );
}

export function getCustomType(value: unknown) {
  if (isCustomType(value)) {
    return value[0];
  }
  return null;
}

export function customType<T>(id: string, value: T): unknown {
  assertOfType(id, 'string', 'Custom type id');
  const result: CustomType<T> = [id, value, customTypeSecret];
  return result;
}

export function createReplacer(callback?: ReplacerCallback): JsonCallback;
export function createReplacer(
  serializer: SerializerReplacer,
  fallback?: ReplacerCallback,
): JsonCallback;
export function createReplacer(
  replacer: ReplacerCallback | SerializerReplacer = identity,
  fallback: ReplacerCallback = identity,
): JsonCallback {
  const callback =
    typeof replacer === 'function'
      ? replacer
      : replacer.getReplacerCallback(fallback);
  return function (key, value) {
    if (isCustomType(value) || isCustomType(this)) {
      return value;
    }
    return callback(value, {parent: this, key});
  };
}

export function createReviver(callback?: ReviverCallback): JsonCallback;
export function createReviver(
  serializer: SerializerReviver,
  fallback?: ReviverCallback,
): JsonCallback;
export function createReviver(
  reviver: ReviverCallback | SerializerReviver = identity,
  fallback: ReviverCallback = identity,
): JsonCallback {
  const callback =
    typeof reviver === 'function'
      ? reviver
      : reviver.getReviverCallback(fallback);
  return function (key, json) {
    if (isCustomType(this)) {
      return json;
    }
    let id: string | null = null;
    let value: unknown;
    if (isCustomType(json)) {
      [id, value] = json;
    } else {
      value = json;
    }
    return callback(value, id, {parent: this, key});
  };
}

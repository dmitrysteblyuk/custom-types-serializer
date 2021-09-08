import {TypedSerializer} from './serializer';
import {TypedDeserializer} from './deserializer';
import type {
  DeserializerContextWithState,
  SerializerContextWithState,
} from './types';
import {assertIsNonEmptyString} from './utils';

export function customType<T>(id: string) {
  return new CustomType<T>(id);
}
export type {CustomType};

class CustomType<T> {
  #id;
  constructor(id: string) {
    assertIsNonEmptyString(id, 'Custom type id');
    this.#id = id;
  }
  getId() {
    return this.#id;
  }
  setId(id: string) {
    assertIsNonEmptyString(id, 'Custom type new id');
    this.#id = id;
  }
  createSerializer<V, S = undefined>(
    check:
      | ((
          value: unknown,
          context: DeserializerContextWithState<S>,
        ) => value is V)
      | ((value: unknown, context: DeserializerContextWithState<S>) => boolean),
    replace: (value: V, context: DeserializerContextWithState<S>) => T,
    createState?: () => S,
  ) {
    return new TypedSerializer<V, T>(this, (next) => {
      const state = createState?.()!;

      return (value, typed, context) => {
        const contextWithState = {...context, state};

        if (check(value, contextWithState)) {
          return typed(this.#id, replace(value, contextWithState));
        }
        return next(value, typed, context);
      };
    });
  }
  createDeserializer<V, S = undefined>(
    revive: (value: T, context: SerializerContextWithState<S>) => V,
    createState?: () => S,
  ) {
    return new TypedDeserializer<T, V>(this, (next) => {
      const state = createState?.()!;

      return (value, typeId, context) => {
        if (typeId === this.#id) {
          return revive(value as T, {...context, state});
        }
        return next(value, typeId, context);
      };
    });
  }
}

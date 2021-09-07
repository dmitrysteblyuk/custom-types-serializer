import {TypedReplacer} from './replacer';
import {TypedReviver} from './reviver';
import type {ReplacerContextWithState, ReviverContextWithState} from './types';
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
  createReplacer<V, S = undefined>(
    check:
      | ((value: unknown, context: ReplacerContextWithState<S>) => value is V)
      | ((value: unknown, context: ReplacerContextWithState<S>) => boolean),
    replace: (value: V, context: ReplacerContextWithState<S>) => T,
    createState?: () => S,
  ) {
    return new TypedReplacer<V, T>(this, (next) => {
      const state = createState?.()!;

      return (value, typed, context) => {
        const replacerContext = {...context, state};

        if (check(value, replacerContext)) {
          return typed(this.#id, replace(value, replacerContext));
        }
        return next(value, typed, context);
      };
    });
  }
  createReviver<V, S = undefined>(
    revive: (value: T, context: ReviverContextWithState<S>) => V,
    createState?: () => S,
  ) {
    return new TypedReviver<T, V>(this, (next) => {
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

import {assertTypesAreUnique, applyMiddleware, identity} from './utils';
import {defaultCoreModule} from './core-default';
import type {CustomType} from './custom-type';
import type {ReviverCallback} from './types';

export type ReviverMiddleware = (next: ReviverCallback) => ReviverCallback;

export abstract class Reviver {
  static getCallback(
    callback: ReviverCallback = identity,
    coreModule = defaultCoreModule,
  ) {
    return coreModule.createReviverCallback(callback);
  }
  static combine(...revivers: Reviver[]) {
    const flattened = revivers.flatMap((reviver) =>
      reviver.isCombined() ? reviver.getRevivers() : reviver,
    );
    assertTypesAreUnique(flattened);
    const middlewares = flattened.map((reviver) => reviver.#middleware);

    return new CombinedReviver(flattened, (next) => {
      return middlewares.reduce(applyMiddleware, next);
    });
  }
  readonly #middleware;

  protected constructor(middleware: ReviverMiddleware) {
    this.#middleware = middleware;
  }
  getCallback(
    fallback: ReviverCallback = identity,
    coreModule = defaultCoreModule,
  ) {
    return coreModule.createReviverCallback(this.#middleware(fallback));
  }
  abstract isCombined(): this is CombinedReviver;
  abstract isTyped<T, V>(): this is TypedReviver<T, V>;
}

export class CombinedReviver extends Reviver {
  readonly #revivers: Reviver[];

  constructor(revivers: Reviver[], middleware: ReviverMiddleware) {
    super(middleware);
    this.#revivers = revivers;
  }
  getRevivers() {
    return [...this.#revivers];
  }
  isCombined() {
    return true as const;
  }
  isTyped() {
    return false as const;
  }
}

export class TypedReviver<T, _V> extends Reviver {
  readonly #customType;

  constructor(customType: CustomType<T>, middleware: ReviverMiddleware) {
    super(middleware);
    this.#customType = customType;
  }
  getType() {
    return this.#customType;
  }
  isCombined() {
    return false as const;
  }
  isTyped() {
    return true as const;
  }
}

import {applyMiddleware, assertTypesAreUnique, identity} from './utils';
import {defaultCoreModule} from './core-default';
import type {CustomType} from './custom-type';
import type {ReplacerCallback} from './types';

export type ReplacerMiddleware = (next: ReplacerCallback) => ReplacerCallback;

export abstract class Replacer {
  static getCallback(
    callback: ReplacerCallback = identity,
    coreModule = defaultCoreModule,
  ) {
    return coreModule.createReplacerCallback(callback);
  }
  static combine(...replacers: Replacer[]) {
    const flattened = replacers.flatMap((replacer) =>
      replacer.isCombined() ? replacer.getReplacers() : replacer,
    );
    assertTypesAreUnique(flattened);
    const middlewares = flattened.map((replacer) => replacer.#middleware);

    return new CombinedReplacer(flattened, (next) => {
      return middlewares.reduceRight(applyMiddleware, next);
    });
  }
  readonly #middleware;

  protected constructor(middleware: ReplacerMiddleware) {
    this.#middleware = middleware;
  }
  getCallback(
    fallback: ReplacerCallback = identity,
    coreModule = defaultCoreModule,
  ) {
    return coreModule.createReplacerCallback(this.#middleware(fallback));
  }
  abstract isCombined(): this is CombinedReplacer;
  abstract isTyped<V, T>(): this is TypedReplacer<V, T>;
}

export class CombinedReplacer extends Replacer {
  readonly #replacers: Replacer[];

  constructor(replacers: Replacer[], middleware: ReplacerMiddleware) {
    super(middleware);
    this.#replacers = replacers;
  }
  getReplacers() {
    return [...this.#replacers];
  }
  isCombined() {
    return true as const;
  }
  isTyped() {
    return false as const;
  }
}

export class TypedReplacer<_V, T> extends Replacer {
  readonly #customType;

  constructor(customType: CustomType<T>, middleware: ReplacerMiddleware) {
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

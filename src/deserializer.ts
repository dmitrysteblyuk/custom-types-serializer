import {assertTypesAreUnique, applyMiddleware, identity} from './utils';
import {defaultCoreModule} from './core-default';
import type {CustomType} from './custom-type';
import type {DeserializerCallback} from './types';

export type DeserializerMiddleware = (
  next: DeserializerCallback,
) => DeserializerCallback;

export abstract class Deserializer {
  static getReviver(
    callback: DeserializerCallback = identity,
    coreModule = defaultCoreModule,
  ) {
    return coreModule.createReviver(callback);
  }
  static combine(...deserializers: Deserializer[]) {
    const flattened = deserializers.flatMap((item) =>
      item.isCombined() ? item.getDeserializers() : item,
    );
    assertTypesAreUnique(flattened);
    const middlewares = flattened.map((item) => item.#middleware);

    return new CombinedDeserializer(flattened, (next) => {
      return middlewares.reduce(applyMiddleware, next);
    });
  }
  readonly #middleware;

  protected constructor(middleware: DeserializerMiddleware) {
    this.#middleware = middleware;
  }
  getReviver(
    fallback: DeserializerCallback = identity,
    coreModule = defaultCoreModule,
  ) {
    return coreModule.createReviver(this.#middleware(fallback));
  }
  abstract isCombined(): this is CombinedDeserializer;
  abstract isTyped<T, V>(): this is TypedDeserializer<T, V>;
}

export class CombinedDeserializer extends Deserializer {
  readonly #deserializers: Deserializer[];

  constructor(
    deserializers: Deserializer[],
    middleware: DeserializerMiddleware,
  ) {
    super(middleware);
    this.#deserializers = deserializers;
  }
  getDeserializers() {
    return [...this.#deserializers];
  }
  isCombined() {
    return true as const;
  }
  isTyped() {
    return false as const;
  }
}

export class TypedDeserializer<T, _V> extends Deserializer {
  readonly #customType;

  constructor(customType: CustomType<T>, middleware: DeserializerMiddleware) {
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

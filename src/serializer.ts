import {applyMiddleware, assertTypesAreUnique, identity} from './utils';
import {defaultCoreModule} from './core-default';
import type {CustomType} from './custom-type';
import type {SerializerCallback} from './types';

export type SerializerMiddleware = (
  next: SerializerCallback,
) => SerializerCallback;

export abstract class Serializer {
  static getReplacer(
    callback: SerializerCallback = identity,
    coreModule = defaultCoreModule,
  ) {
    return coreModule.createReplacer(callback);
  }
  static combine(...serializers: Serializer[]) {
    const flattened = serializers.flatMap((item) =>
      item.isCombined() ? item.getSerializers() : item,
    );
    assertTypesAreUnique(flattened);
    const middlewares = flattened.map((item) => item.#middleware);

    return new CombinedSerializer(flattened, (next) => {
      return middlewares.reduceRight(applyMiddleware, next);
    });
  }
  readonly #middleware;

  protected constructor(middleware: SerializerMiddleware) {
    this.#middleware = middleware;
  }
  getReplacer(
    fallback: SerializerCallback = identity,
    coreModule = defaultCoreModule,
  ) {
    return coreModule.createReplacer(this.#middleware(fallback));
  }
  abstract isCombined(): this is CombinedSerializer;
  abstract isTyped<V, T>(): this is TypedSerializer<V, T>;
}

export class CombinedSerializer extends Serializer {
  readonly #serializers: Serializer[];

  constructor(serializers: Serializer[], middleware: SerializerMiddleware) {
    super(middleware);
    this.#serializers = serializers;
  }
  getSerializers() {
    return [...this.#serializers];
  }
  isCombined() {
    return true as const;
  }
  isTyped() {
    return false as const;
  }
}

export class TypedSerializer<_V, T> extends Serializer {
  readonly #customType;

  constructor(customType: CustomType<T>, middleware: SerializerMiddleware) {
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

import {customType} from './core';
import type {
  Context,
  ReplacerMiddleware,
  ReviverMiddleware,
  SerializerReplacer,
  SerializerReviver,
} from './types';
import {assertOfType, identity} from './utils';

export type TypedSerializerConfig<I, O> = Readonly<{
  id: string;
  check:
    | ((value: unknown, context: Context) => value is I)
    | ((value: unknown, context: Context) => boolean);
  replace: (value: I, context: Context) => O;
  revive: (value: O, context: Context) => I;
}>;

export abstract class Serializer
  implements SerializerReplacer, SerializerReviver
{
  static create<I, O>(
    id: TypedSerializerConfig<I, O>['id'],
    check: TypedSerializerConfig<I, O>['check'],
    replace: TypedSerializerConfig<I, O>['replace'],
    revive: TypedSerializerConfig<I, O>['revive'],
  ) {
    return new TypedSerializer({id, check, replace, revive});
  }
  static combine(...serializers: readonly Serializer[]) {
    return new CombinedSerializer(serializers);
  }
  static custom(
    getReplacerCallback: ReplacerMiddleware = identity,
    getReviverCallback: ReviverMiddleware = identity,
  ) {
    return new CustomSerializer(getReplacerCallback, getReviverCallback);
  }

  protected constructor(
    readonly getReplacerCallback: ReplacerMiddleware,
    readonly getReviverCallback: ReviverMiddleware,
  ) {}
  abstract isCombined(): this is CombinedSerializer;
  abstract isTyped<I, O>(): this is TypedSerializer<I, O>;
}

export class TypedSerializer<I, O> extends Serializer {
  readonly #config: TypedSerializerConfig<I, O>;

  constructor({id, check, replace, revive}: TypedSerializerConfig<I, O>) {
    assertOfType(id, 'string', 'Serializer id');

    super(
      (next) => (value, context) =>
        check(value, context)
          ? customType(id, replace(value, context))
          : next(value, context),
      (next) => (value, type, context) =>
        type === id ? revive(value as O, context) : next(value, type, context),
    );
    this.#config = {id, check, replace, revive};
  }
  getId() {
    return this.#config.id;
  }
  getConfig(): TypedSerializerConfig<I, O> {
    return {...this.#config};
  }
  isCombined() {
    return false as const;
  }
  isTyped() {
    return true as const;
  }
}

function applyMiddleware<T>(next: T, middleware: (next: T) => T) {
  return middleware(next);
}

export class CombinedSerializer extends Serializer {
  readonly #serializers: Serializer[];

  constructor(serializers: readonly Serializer[]) {
    const flattened = serializers.flatMap((x) =>
      x.isCombined() ? x.#serializers : [x],
    );
    assertSerializersHaveUniqueIds(flattened);
    const replacers = flattened.map((x) => x.getReplacerCallback);
    const revivers = flattened.map((x) => x.getReviverCallback);

    super(
      (next) => replacers.reduceRight(applyMiddleware, next),
      (next) => revivers.reduce(applyMiddleware, next),
    );
    this.#serializers = flattened;
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

function assertSerializersHaveUniqueIds(serializers: Serializer[]) {
  const allIds = new Set<string>();
  for (const serializer of serializers) {
    if (!serializer.isTyped()) {
      continue;
    }
    const id = serializer.getId();
    if (allIds.has(id)) {
      throw new Error(`Duplicate serializer "${id}".`);
    }
    allIds.add(id);
  }
}

export class CustomSerializer extends Serializer {
  isCombined() {
    return false as const;
  }
  isTyped() {
    return false as const;
  }
}

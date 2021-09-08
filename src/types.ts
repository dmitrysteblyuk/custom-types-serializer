export type WrapWithType = (type: string, value: unknown) => unknown;
export type DeserializerContext = Readonly<{
  parentObject: object;
  key: string;
  original: unknown;
}>;
export type SerializerContext = Readonly<{parentObject: object; key: string}>;

export type SerializerCallback = (
  value: unknown,
  typed: WrapWithType,
  context: DeserializerContext,
) => unknown;
export type DeserializerCallback = (
  value: unknown,
  type: string | null,
  context: SerializerContext,
) => unknown;

export type SerializerContextWithState<S> = Readonly<
  SerializerContext & {state: S}
>;
export type DeserializerContextWithState<S> = Readonly<
  DeserializerContext & {state: S}
>;

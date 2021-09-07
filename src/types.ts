export type WrapWithType = (type: string, value: unknown) => unknown;
export type ReplacerContext = Readonly<{
  parentObject: object;
  key: string;
  original: unknown;
}>;
export type ReviverContext = Readonly<{parentObject: object; key: string}>;

export type ReplacerCallback = (
  value: unknown,
  typed: WrapWithType,
  context: ReplacerContext,
) => unknown;
export type ReviverCallback = (
  value: unknown,
  type: string | null,
  context: ReviverContext,
) => unknown;

export type ReviverContextWithState<S> = Readonly<ReviverContext & {state: S}>;
export type ReplacerContextWithState<S> = Readonly<
  ReplacerContext & {state: S}
>;

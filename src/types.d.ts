export type JsonCallback = (
  this: Parent,
  key: string,
  value: unknown,
) => unknown;

export type Parent = Readonly<Record<string, unknown>>;
export type Context = Readonly<{
  parent: Parent;
  key: string;
}>;

export type ReplacerCallback = (value: unknown, context: Context) => unknown;
export type ReviverCallback = (
  value: unknown,
  type: string | null,
  context: Context,
) => unknown;

export type ReplacerMiddleware = (next: ReplacerCallback) => ReplacerCallback;
export type ReviverMiddleware = (next: ReviverCallback) => ReviverCallback;

export type SerializerReplacer = Readonly<{
  getReplacerCallback: ReplacerMiddleware;
}>;
export type SerializerReviver = Readonly<{
  getReviverCallback: ReviverMiddleware;
}>;

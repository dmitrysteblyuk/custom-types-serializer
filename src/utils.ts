const _anyType = typeof (null as unknown);

export type JSType = typeof _anyType;

export function assertOfType(value: unknown, type: JSType, name: string) {
  if (typeof value === type) {
    return;
  }
  throw new Error(`${name} must be a ${type}. Received: "${value}".`);
}

export function identity<T>(x: T) {
  return x;
}

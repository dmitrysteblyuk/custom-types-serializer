import type {CustomType} from './custom-type';

export function assertIsNonEmptyString(
  value: unknown,
  name: string,
): asserts value is string {
  if (typeof value === 'string' && value !== '') {
    return;
  }
  throw new Error(`${name} must be a non-empty string. Received: "${value}".`);
}

export function identity<T>(x: T) {
  return x;
}

export function applyMiddleware<T>(result: T, middleware: (next: T) => T) {
  return middleware(result);
}

interface Instance {
  isTyped(): this is {getType(): CustomType<unknown>};
}

export function assertTypesAreUnique(instances: Instance[]) {
  const typeIds = new Set<string>();
  for (const instance of instances) {
    if (!instance.isTyped()) {
      continue;
    }
    const id = instance.getType().getId();
    if (typeIds.has(id)) {
      throw new Error(`Duplicate custom type "${id}".`);
    }
    typeIds.add(id);
  }
}

import {referenceType} from './types';

class Reference {
  constructor(readonly id: number, readonly original: object) {}
}
export type {Reference};

export const referenceSerializer = referenceType.createSerializer(
  (_value, {original, parentObject}): _value is object => {
    if (
      (typeof original === 'object' && original !== null) ||
      typeof original === 'function'
    ) {
      if (parentObject instanceof Reference) {
        return false;
      }
      return true;
    }
    return false;
  },
  (_value, {original, state}) => {
    const value = original as object;
    if (state.references.has(value)) {
      return state.references.get(value)!;
    }
    const id = state.counter++;
    state.references.set(value, id);
    return new Reference(id, value);
  },
  () => ({counter: 0, references: new WeakMap<object, number>()}),
);

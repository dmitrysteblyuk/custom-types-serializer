import {referenceType} from './types';

export const referenceReviver = referenceType.createReviver(
  (x, {state: {values, pending}, parentObject, key}) => {
    if (typeof x === 'number') {
      if (values.has(x)) {
        return values.get(x);
      }
      if (pending.has(x)) {
        pending.get(x)!.push({parentObject, key});
      } else {
        pending.set(x, [{parentObject, key}]);
      }
      return;
    }
    const {id, original} = x;
    values.set(id, original);

    if (pending.has(id)) {
      for (const {parentObject, key} of pending.get(id)!) {
        parentObject[key] = original;
      }
    }
    return original;
  },
  () => ({
    values: new Map<number, object>(),
    pending: new Map<number, {parentObject: any; key: string}[]>(),
  }),
);

import {weaksetType} from './types';

export const weaksetDeserializer = weaksetType.createDeserializer(
  () => new WeakSet(),
);

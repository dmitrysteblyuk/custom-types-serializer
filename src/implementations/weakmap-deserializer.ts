import {weakmapType} from './types';

export const weakmapDeserializer = weakmapType.createDeserializer(
  () => new WeakMap(),
);

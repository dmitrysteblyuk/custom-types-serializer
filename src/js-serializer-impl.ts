import {Serializer} from './serializer';
import {
  undefinedSerializer,
  numberSerializer,
  bigintSerializer,
  symbolSerializer,
  dateSerializer,
  urlSerializer,
  errorSerializer,
  regexpSerializer,
  setSerializer,
  mapSerializer,
  weakmapSerializer,
  weaksetSerializer,
} from './serializers-impl';

export const jsSerializer = Serializer.combine(
  undefinedSerializer,
  numberSerializer,
  bigintSerializer,
  symbolSerializer,
  dateSerializer,
  urlSerializer,
  errorSerializer,
  regexpSerializer,
  setSerializer,
  mapSerializer,
  weakmapSerializer,
  weaksetSerializer,
);

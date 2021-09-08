import {describe, it, expect} from '@jest/globals';
import {Serializer} from '../serializer';
import {Deserializer} from '../deserializer';
import {referenceSerializer} from './reference-serializer';
import {referenceDeserializer} from './reference-deserializer';
import {dateSerializer} from './date-serializer';
import {dateDeserializer} from './date-deserializer';
import {mapSerializer} from './map-serializer';
import {mapDeserializer} from './map-deserializer';

describe('referenceSerializer/referenceDeserializer', () => {
  it('serializes references', () => {
    const date = new Date(123);
    const value = {
      array: [date, {date}, {}, date, {}] as const,
      value: {},
      date,
    };
    value.value = value;
    (value.array as any)[4] = value;

    const serialized = JSON.stringify(
      value,
      Serializer.combine(referenceSerializer, dateSerializer).getReplacer(),
    );
    const deserialized: typeof value = JSON.parse(
      serialized,
      Deserializer.combine(
        referenceDeserializer,
        dateDeserializer,
      ).getReviver(),
    );
    expect(deserialized).toStrictEqual(value);
    expect(deserialized).not.toBe(value);
    expect(deserialized.value).toBe(deserialized);
    expect(deserialized).toBe(deserialized.array[4]);
    expect(deserialized.date).toBeInstanceOf(Date);
    expect(deserialized.date).toBe(deserialized.array[0]);
    expect(deserialized.date).toBe(deserialized.array[1].date);
    expect(deserialized.date).toBe(deserialized.array[3]);
  });

  it('should work for the example from Readme', () => {
    const mySerializer = Serializer.combine(referenceSerializer, mapSerializer);
    const myDeserializer = Deserializer.combine(
      referenceDeserializer,
      mapDeserializer,
    );

    const data = new Map();
    const circular = {data};
    data.set('a', circular);
    data.set('b', circular);

    const serialized = JSON.stringify(data, mySerializer.getReplacer());
    const deserialized = JSON.parse(serialized, myDeserializer.getReviver());

    expect(deserialized.get('a').data).toBe(deserialized);
    expect(deserialized.get('a')).toBe(deserialized.get('b'));
  });
});

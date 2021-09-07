import {describe, it, expect} from '@jest/globals';
import {Replacer} from '../replacer';
import {Reviver} from '../reviver';
import {referenceReplacer} from './reference-replacer';
import {referenceReviver} from './reference-reviver';
import {dateReplacer} from './date-replacer';
import {dateReviver} from './date-reviver';
import {mapReplacer} from './map-replacer';
import {mapReviver} from './map-reviver';

describe('referenceReplacer/referenceReviver', () => {
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
      Replacer.combine(referenceReplacer, dateReplacer).getCallback(),
    );
    const deserialized: typeof value = JSON.parse(
      serialized,
      Reviver.combine(referenceReviver, dateReviver).getCallback(),
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
    const myReplacer = Replacer.combine(referenceReplacer, mapReplacer);
    const myReviver = Reviver.combine(referenceReviver, mapReviver);

    const data = new Map();
    const circular = {data};
    data.set('a', circular);
    data.set('b', circular);

    const serialized = JSON.stringify(data, myReplacer.getCallback());
    const deserialized = JSON.parse(serialized, myReviver.getCallback());

    expect(deserialized.get('a').data).toBe(deserialized);
    expect(deserialized.get('a')).toBe(deserialized.get('b'));
  });
});

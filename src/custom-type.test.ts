import {describe, it, expect} from '@jest/globals';
import moment = require('moment');
import {customType} from './custom-type';

describe('customType()', () => {
  it('should work for the example with Moment from Readme', () => {
    const momentType = customType<string>('Moment');
    const momentSerializer = momentType.createSerializer(
      // Use `original` value because moment implements `.toJSON()`.
      (_value, {original}) => moment.isMoment(original),
      String,
    );
    const momentDeserializer = momentType.createDeserializer((isoString) =>
      moment(isoString),
    );

    const data = {
      date: moment('2018-06-26 17:30'),
    };
    const serialized = JSON.stringify(data, momentSerializer.getReplacer());
    const deserialized: typeof data = JSON.parse(
      serialized,
      momentDeserializer.getReviver(),
    );

    expect(deserialized.date.format('MMMM Do YYYY, h:mm:ss a')).toBe(
      'June 26th 2018, 5:30:00 pm',
    );
  });

  it('should work for the example with functions from Readme', () => {
    const registeredFunctions: Function[] = [];
    const functionType = customType<number>('Function');
    const functionSerializer = functionType.createSerializer(
      (x): x is Function => typeof x === 'function',
      (fn) => registeredFunctions.push(fn) - 1,
    );
    const functionDeserializer = functionType.createDeserializer(
      (id) => registeredFunctions[id],
    );

    const serialized = JSON.stringify(
      {
        doSmth() {
          return 'okay';
        },
      },
      functionSerializer.getReplacer(),
    );
    const deserialized = JSON.parse(
      serialized,
      functionDeserializer.getReviver(),
    );

    expect(deserialized.doSmth()).toBe('okay');
  });
});

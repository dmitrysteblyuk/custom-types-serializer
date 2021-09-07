import {describe, it, expect} from '@jest/globals';
import moment = require('moment');
import {customType} from './custom-type';

describe('customType()', () => {
  it('should work for the example with Moment from Readme', () => {
    const momentType = customType<string>('Moment');
    const momentReplacer = momentType.createReplacer(
      // Use `original` value because moment implements `.toJSON()`.
      (_value, {original}) => moment.isMoment(original),
      String,
    );
    const momentReviver = momentType.createReviver((isoString) =>
      moment(isoString),
    );

    const data = {
      date: moment('2018-06-26 17:30'),
    };
    const serialized = JSON.stringify(data, momentReplacer.getCallback());
    const deserialized: typeof data = JSON.parse(
      serialized,
      momentReviver.getCallback(),
    );

    expect(deserialized.date.format('MMMM Do YYYY, h:mm:ss a')).toBe(
      'June 26th 2018, 5:30:00 pm',
    );
  });

  it('should work for the example with functions from Readme', () => {
    const registeredFunctions: Function[] = [];
    const functionType = customType<number>('Function');
    const functionReplacer = functionType.createReplacer(
      (x): x is Function => typeof x === 'function',
      (fn) => registeredFunctions.push(fn) - 1,
    );
    const functionReviver = functionType.createReviver(
      (id) => registeredFunctions[id],
    );

    const serialized = JSON.stringify(
      {
        doSmth() {
          return 'okay';
        },
      },
      functionReplacer.getCallback(),
    );
    const deserialized = JSON.parse(serialized, functionReviver.getCallback());

    expect(deserialized.doSmth()).toBe('okay');
  });
});

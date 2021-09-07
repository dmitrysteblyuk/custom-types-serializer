import {describe, it, expect} from '@jest/globals';
import {customType} from './custom-type';
import {Reviver} from './reviver';

describe('Reviver', () => {
  it('should not allow duplicate types', () => {
    const combined = Reviver.combine(
      Reviver.combine(
        customType('type1').createReviver(() => null),
        customType('type2').createReviver(() => null),
      ),
      Reviver.combine(
        Reviver.combine(customType('type3').createReviver(() => null)),
        customType('type4').createReviver(() => null),
        customType('type5').createReviver(() => null),
      ),
    );
    expect(combined.getRevivers().length).toBe(5);

    expect(() => {
      Reviver.combine(
        combined,
        customType('type3').createReviver(() => null),
      );
    }).toThrowError(new Error('Duplicate custom type "type3".'));
  });
});

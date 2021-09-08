import {describe, it, expect} from '@jest/globals';
import {customType} from './custom-type';
import {Serializer} from './serializer';
import {identity} from './utils';

describe('Serializer', () => {
  it('should not allow duplicate types', () => {
    const combined = Serializer.combine(
      Serializer.combine(
        customType('type1').createSerializer(() => false, identity),
        customType('type2').createSerializer(() => false, identity),
      ),
      Serializer.combine(
        Serializer.combine(
          customType('type3').createSerializer(() => false, identity),
        ),
        customType('type4').createSerializer(() => false, identity),
        customType('type5').createSerializer(() => false, identity),
      ),
    );
    expect(combined.getSerializers().length).toBe(5);

    expect(() => {
      Serializer.combine(
        combined,
        customType('type3').createSerializer(() => false, identity),
      );
    }).toThrowError(new Error('Duplicate custom type "type3".'));
  });
});

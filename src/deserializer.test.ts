import {describe, it, expect} from '@jest/globals';
import {customType} from './custom-type';
import {Deserializer} from './deserializer';

describe('Deserializer', () => {
  it('should not allow duplicate types', () => {
    const combined = Deserializer.combine(
      Deserializer.combine(
        customType('type1').createDeserializer(() => null),
        customType('type2').createDeserializer(() => null),
      ),
      Deserializer.combine(
        Deserializer.combine(
          customType('type3').createDeserializer(() => null),
        ),
        customType('type4').createDeserializer(() => null),
        customType('type5').createDeserializer(() => null),
      ),
    );
    expect(combined.getDeserializers().length).toBe(5);

    expect(() => {
      Deserializer.combine(
        combined,
        customType('type3').createDeserializer(() => null),
      );
    }).toThrowError(new Error('Duplicate custom type "type3".'));
  });
});

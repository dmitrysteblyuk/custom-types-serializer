import {describe, it, expect} from '@jest/globals';
import {Serializer} from './serializer';
import {identity} from './utils';

describe('Serializer', () => {
  it('should not allow duplicate types', () => {
    const combined = Serializer.combine(
      Serializer.combine(
        Serializer.create('custom-type1', () => false, identity, identity),
        Serializer.create('custom-type2', () => false, identity, identity),
      ),
      Serializer.combine(
        Serializer.combine(
          Serializer.create('custom-type3', () => false, identity, identity),
        ),
        Serializer.create('custom-type4', () => false, identity, identity),
        Serializer.create('custom-type5', () => false, identity, identity),
      ),
    );
    expect(combined.getSerializers().length).toBe(5);

    expect(() => {
      Serializer.combine(
        combined,
        Serializer.create('custom-type3', () => false, identity, identity),
      );
    }).toThrowError(new Error('Duplicate serializer "custom-type3".'));
  });
});

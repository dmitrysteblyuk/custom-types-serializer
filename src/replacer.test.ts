import {describe, it, expect} from '@jest/globals';
import {customType} from './custom-type';
import {Replacer} from './replacer';
import {identity} from './utils';

describe('Replacer', () => {
  it('should not allow duplicate types', () => {
    const combined = Replacer.combine(
      Replacer.combine(
        customType('type1').createReplacer(() => false, identity),
        customType('type2').createReplacer(() => false, identity),
      ),
      Replacer.combine(
        Replacer.combine(
          customType('type3').createReplacer(() => false, identity),
        ),
        customType('type4').createReplacer(() => false, identity),
        customType('type5').createReplacer(() => false, identity),
      ),
    );
    expect(combined.getReplacers().length).toBe(5);

    expect(() => {
      Replacer.combine(
        combined,
        customType('type3').createReplacer(() => false, identity),
      );
    }).toThrowError(new Error('Duplicate custom type "type3".'));
  });
});

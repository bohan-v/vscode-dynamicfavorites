import { describe } from 'mocha';
import { it } from 'mocha';
import { ConfigurationParser } from '../../configuration_parser';
import { expect } from 'chai';
import { CategoryRule } from '../../settings/category_rule';

describe('ConfigurationParser', () => {
  it('should return valid categoryRules from config', () => {
    const expectedRules: CategoryRule[] = [
      new CategoryRule('sectionLabel', 'pattern', 'iconNae'),
      new CategoryRule('sectionLabel2', 'pattern2', 'iconNae2')
    ];
    const patterns = expectedRules.map(rule => JSON.stringify(rule));
    const result = ConfigurationParser.categoryRules(patterns);
    expect(result).to.deep.equal(expectedRules);
  });
});

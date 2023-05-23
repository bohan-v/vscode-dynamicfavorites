import { CategoryRule } from './settings/category_rule';
import Ajv from 'ajv';
import { categoryRuleJSONSchema } from './settings/category_rule_json_schema';

export class ConfigurationParser {
  static categoryRules(patterns: string[]): CategoryRule[] {
    let categoriesPattern: CategoryRule[] = [];
    const ajv = new Ajv();
    const validateSchema = ajv.compile(categoryRuleJSONSchema);
    for (const pattern of patterns) {
      let obj: CategoryRule = JSON.parse(pattern);
      let valid = validateSchema(obj);
      if (!valid) {
        console.log("not valid");
      } else {
        categoriesPattern.push(obj);
      }
    }
    return categoriesPattern;
  }
}

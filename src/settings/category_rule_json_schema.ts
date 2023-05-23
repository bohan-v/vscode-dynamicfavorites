export const categoryRuleJSONSchema = {
  "type": "object",
  "properties": {
    "sectionLabel": {
      "type": "string"
    },
    "pattern": {
      "type": "string"
    },
    "iconName": {
      "type": ["string", "null"]
    }
  },
  "required": ["sectionLabel", "pattern"],
  "additionalProperties": false
};

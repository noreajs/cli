export const validateObject = <T>(
  obj: T,
  rules: {
    [value in keyof T]: [
      { errorMessage: string; validator: (value: any, obj: T) => boolean }
    ];
  }
): {
  valid: boolean;
  message: string;
  errors: {
    [key: string]: {
      errors: Array<string>;
    };
  };
} => {
  const errors: string[] = [];
  const messages: {
    [key: string]: {
      errors: Array<string>;
    };
  } = {};

  for (const key in obj) {
    if ((obj as any).hasOwnProperty(key)) {
      const element = obj[key];

      const elmtRules = rules[key];

      for (const rule of elmtRules) {
        if (!rule.validator(element, obj)) {
          errors.push(rule.errorMessage);
          if (messages[key]) {
            messages[key].errors.push(rule.errorMessage);
          } else {
            messages[key] = {
              errors: [rule.errorMessage],
            };
          }
        }
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors: messages,
    message: errors.join("; "),
  };
};

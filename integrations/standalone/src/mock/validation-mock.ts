import type { ComponentData, FormData, Input, Select, ValidationResult } from '@axonivy/form-editor-protocol';

const validationUrl = (code: string) => `https://developer.axonivy.com/doc/14.0/en/reference/validation/codes/${code}.html`;

export const validateMock = (data: FormData): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  validateDeep(data.components, validations);
  const code = 'form.global.warning';
  validations.push({ path: 'Input-1', message: 'Global warning', severity: 'WARNING', code, url: validationUrl(code) });
  return validations;
};

const validateDeep = (components: Array<ComponentData>, validations: Array<ValidationResult>) => {
  components.forEach(c => {
    if ('components' in c.config) {
      validateDeep(c.config.components as Array<ComponentData>, validations);
    }
    if (c.type === 'Input') {
      const config = c.config as Input;
      if (config.value === undefined || (config.value as string).length === 0) {
        const code = 'form.input.value.required';
        validations.push({ path: `${c.cid}.value`, message: 'Value is required', severity: 'ERROR', code, url: validationUrl(code) });
      }
    }
    if (c.type === 'Select') {
      const config = c.config as Select;
      if (config.value === undefined || (config.value as string).length === 0) {
        const code = 'form.select.value.required';
        validations.push({ path: `${c.cid}.value`, message: 'Value is required', severity: 'WARNING', code, url: validationUrl(code) });
      }
    }
  });
};

import type { Severity, ValidationResult } from '@axonivy/form-editor-protocol';
import { useAppContext } from './AppContext';
import type { MessageData } from '@axonivy/ui-components';

export function useValidations(path: string, options?: { exact?: boolean }): Array<MessageData> {
  const { validations } = useAppContext();
  if (options?.exact) {
    return validations.filter(val => val.path === path).map<MessageData>(toMessageData);
  }
  return validations.filter(val => val.path === path || val.path.startsWith(`${path}.`)).map<MessageData>(toMessageData);
}

export function useValidation(path: string): MessageData | undefined {
  const { validations } = useAppContext();
  return toMessageData(validations.find(val => val.path === path));
}

function toMessageData(validation: ValidationResult): MessageData;
function toMessageData(validation?: ValidationResult): MessageData | undefined;
function toMessageData(validation?: ValidationResult): MessageData | undefined {
  if (validation) {
    return { message: validation.message, variant: validation.severity.toLocaleLowerCase() as Lowercase<Severity> };
  }
  return undefined;
}

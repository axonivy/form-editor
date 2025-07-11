import type { Severity, ValidationResult } from '@axonivy/form-editor-protocol';
import type { MessageData, StateDotProps } from '@axonivy/ui-components';
import { useAppContext } from './AppContext';

export function useValidations(path: string, options?: { exact?: boolean }): Array<MessageData> {
  const { validations } = useAppContext();
  if (options?.exact) {
    return validations.filter(val => val.path === path).map<MessageData>(toMessageData);
  }
  return validations.filter(val => val.path.startsWith(path)).map<MessageData>(toMessageData);
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

export function validationsForPaths(paths: string[], validations: ValidationResult[]): Array<MessageData> {
  return validations.filter(val => paths.some(p => val.path.startsWith(p))).map<MessageData>(toMessageData);
}

export function getTabState(validations: Array<MessageData>): StateDotProps {
  if (validations.find(message => message?.variant === 'error')) {
    return { state: 'error', messages: validations };
  }
  if (validations.find(message => message?.variant === 'warning')) {
    return { state: 'warning', messages: validations };
  }
  return { state: undefined, messages: validations };
}

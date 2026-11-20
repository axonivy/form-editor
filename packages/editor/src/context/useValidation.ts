import type { Severity, ValidationResult } from '@axonivy/form-editor-protocol';
import type { MessageData, StateDotProps } from '@axonivy/ui-components';
import { useAppContext } from './AppContext';
import { useAction } from './useAction';

export function useValidations(path: string, options?: { exact?: boolean }): Array<MessageData> {
  const { validations } = useAppContext();
  const openUrl = useAction('openUrl');
  if (options?.exact) {
    return validations.filter(val => val.path === path).map<MessageData>(validation => toMessageData(validation, openUrl));
  }
  return validations
    .filter(val => val.path === path || val.path.startsWith(`${path}.`))
    .map<MessageData>(validation => toMessageData(validation, openUrl));
}

export function useValidation(path: string): MessageData | undefined {
  const { validations } = useAppContext();
  const openUrl = useAction('openUrl');
  return toMessageData(validations.find(val => val.path === path), openUrl);
}

type OpenUrlAction = ReturnType<typeof useAction>;

function toMessageData(validation: ValidationResult, openUrl: OpenUrlAction): MessageData;
function toMessageData(validation: undefined, openUrl: OpenUrlAction): undefined;
function toMessageData(validation: ValidationResult | undefined, openUrl: OpenUrlAction): MessageData | undefined;
function toMessageData(validation: ValidationResult | undefined, openUrl: OpenUrlAction): MessageData | undefined {
  if (validation) {
    return {
      message: validation.message,
      variant: validation.severity.toLocaleLowerCase() as Lowercase<Severity>,
      reference: { tooltip: validation.code, openUrl: () => openUrl(validation.url) }
    };
  }
  return undefined;
}

export function validationsForPaths(paths: string[], validations: ValidationResult[], openUrl: OpenUrlAction): Array<MessageData> {
  return validations
    .filter(val => paths.some(p => val.path.startsWith(p)))
    .map<MessageData>(validation => toMessageData(validation, openUrl));
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

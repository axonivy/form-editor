import { BasicField, BasicInput, type MessageData } from '@axonivy/ui-components';
import type { TextFieldOptions } from '../../../types/config';

export type InputFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  message?: MessageData;
};

export const InputField = ({ label, value, onChange, onBlur, message, options }: InputFieldProps & { options?: TextFieldOptions }) => (
  <BasicField label={label} message={message} tabIndex={0}>
    <BasicInput
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={options?.placeholder}
      disabled={options?.disabled}
    />
  </BasicField>
);

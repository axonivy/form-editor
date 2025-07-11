import { BasicField, BasicInput, type MessageData } from '@axonivy/ui-components';

type InputFieldProps = {
  label: string;
  value: number;
  onChange: (value: string | number) => void;
  message?: MessageData;
};

export const NumberField = ({ label, value, onChange, message }: InputFieldProps) => (
  <BasicField label={label} message={message}>
    <BasicInput type='number' value={value} onChange={e => onChange(Number(e.target.value))} />
  </BasicField>
);

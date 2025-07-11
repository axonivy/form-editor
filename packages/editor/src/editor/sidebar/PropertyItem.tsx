import type { PrimitiveValue, SelectItem } from '@axonivy/form-editor-protocol';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidation } from '../../context/useValidation';
import { useData } from '../../data/data';
import type { Field } from '../../types/config';
import { CheckboxField } from './fields/CheckboxField';
import { InputField } from './fields/InputField';
import { InputFieldWithBrowser } from './fields/InputFieldWithBrowser';
import { NumberField } from './fields/NumberField';
import { SelectField } from './fields/SelectField';
import { SelectTableField } from './fields/table-field/SelectTableField';
import { TextareaField } from './fields/TextareaField';
import { ToggleGroupField } from './fields/ToggleGroupField';

type PropertyItemProps = {
  value: PrimitiveValue;
  onChange: (change: PrimitiveValue) => void;
  field: Field;
  fieldKey: string;
};

const toString = (primitive?: PrimitiveValue) => primitive?.toString() ?? '';
const toNumber = (primitive?: PrimitiveValue) => Number(primitive ?? 0);
const toBoolean = (primitive?: PrimitiveValue) => Boolean(primitive ?? false);
const toSelectItems = (primitive?: PrimitiveValue): Array<SelectItem> => (Array.isArray(primitive) ? primitive : []);

export const PropertyItem = ({ value: initValue, onChange, field, fieldKey }: PropertyItemProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<PrimitiveValue>(initValue);
  const { element } = useData();
  const validationPath = `${element?.cid}.${fieldKey}`;
  const message = useValidation(validationPath);
  const updateValue = (newValue: PrimitiveValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const inputFor = (field: Field) => {
    const label = field.label ?? fieldKey;
    switch (field.type) {
      case 'text':
        return <InputField label={label} value={toString(value)} onChange={updateValue} options={field.options} message={message} />;
      case 'textBrowser':
        return (
          <InputFieldWithBrowser
            label={label}
            value={toString(value)}
            onChange={updateValue}
            browsers={field.browsers}
            options={field.options}
            message={message}
          />
        );
      case 'selectTable':
        return <SelectTableField label={label} data={toSelectItems(value)} onChange={updateValue} validationPath={validationPath} />;
      case 'number':
        return <NumberField label={label} value={toNumber(value)} onChange={updateValue} message={message} />;
      case 'checkbox':
        return <CheckboxField label={label} value={toBoolean(value)} onChange={updateValue} />;
      case 'textarea':
        return <TextareaField label={label} value={toString(value)} onChange={updateValue} message={message} />;
      case 'select':
        return <SelectField label={label} value={toString(value)} onChange={updateValue} options={field.options} message={message} />;
      case 'toggleGroup':
        return <ToggleGroupField label={label} value={toString(value)} onChange={updateValue} options={field.options} message={message} />;
      case 'generic':
        return field.render({ label, value: value, onChange: updateValue, validationPath });
      default:
        return <p>{t('message.fieldTypeUnknown')}</p>;
    }
  };
  if (field.type === 'hidden') {
    return null;
  }
  return <div className='property-item'>{inputFor(field)}</div>;
};

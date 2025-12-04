import { type Input, type InputType, type Prettify, type SymbolPosition } from '@axonivy/form-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Input.css';
import IconSvg from './Input.svg?react';

type InputProps = Prettify<Input>;

export const useInputComponent = () => {
  const { baseComponentFields, behaviourComponentFields } = useBase();
  const [t] = useTranslation();

  const InputComponent = useMemo(() => {
    const typeOptions: FieldOption<InputType>[] = [
      { label: t('property.text'), value: 'TEXT' },
      { label: t('property.email'), value: 'EMAIL' },
      { label: t('property.password'), value: 'PASSWORD' },
      { label: t('property.number'), value: 'NUMBER' }
    ] as const;

    const positionOptions: FieldOption<SymbolPosition>[] = [
      { label: t('property.suffix'), value: 's' },
      { label: t('property.prefix'), value: 'p' }
    ] as const;

    const InputComponent: ComponentConfig<InputProps> = {
      name: 'Input',
      displayName: t('components.input.name'),
      category: 'Elements',
      subcategory: 'Input',
      icon: <IconSvg />,
      description: t('components.input.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        label: {
          subsection: 'General',
          label: t('property.label'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        value: { subsection: 'General', label: t('property.value'), type: 'textBrowser', browsers: [{ type: 'ATTRIBUTE' }] },
        type: { subsection: 'General', label: t('property.type'), type: 'select', options: typeOptions },
        decimalPlaces: {
          subsection: 'Formatting',
          label: t('property.decimalPlaces'),
          type: 'number',
          hide: data => data.type !== 'NUMBER'
        },
        symbol: { subsection: 'Formatting', label: t('property.symbol'), type: 'text', hide: data => data.type !== 'NUMBER' },
        symbolPosition: {
          subsection: 'Formatting',
          label: t('property.symbolPosition'),
          type: 'select',
          options: positionOptions,
          hide: data => !(data.type === 'NUMBER' && data.symbol.length > 0)
        },
        validationMessage: {
          subsection: 'General',
          label: t('label.validationMessage'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }],
          hide: data => data.type !== 'EMAIL'
        },
        ...behaviourComponentFields
      }
    };

    return InputComponent;
  }, [baseComponentFields, behaviourComponentFields, t]);

  return {
    InputComponent
  };
};

const UiBlock = ({ label, required, visible, value, disabled, updateOnChange, symbol, symbolPosition }: UiComponentProps<InputProps>) => (
  <div className='block-input'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
    <span className={`block-input__input ${disabled === 'true' ? 'disabled' : ''}`}>
      {symbolPosition === 'p' && symbol}
      <UiBadge value={value} />
      {symbolPosition === 's' && symbol}
    </span>
  </div>
);

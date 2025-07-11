import { type Prettify, type Textarea } from '@axonivy/form-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Textarea.css';
import IconSvg from './Textarea.svg?react';

type TextareaProps = Prettify<Textarea>;

export const useTextareaComponent = () => {
  const { baseComponentFields, behaviourComponentFields } = useBase();
  const { t } = useTranslation();

  const TextareaComponent = useMemo(() => {
    const TextareaComponent: ComponentConfig<TextareaProps> = {
      name: 'Textarea',
      displayName: t('components.textarea.name'),
      category: 'Elements',
      subcategory: 'Input',
      icon: <IconSvg />,
      description: t('components.textarea.description'),
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
        rows: { subsection: 'General', label: t('components.textarea.property.visibleRows'), type: 'number' },
        autoResize: { subsection: 'General', label: t('components.textarea.property.autoResize'), type: 'checkbox' },
        ...behaviourComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return TextareaComponent;
  }, [baseComponentFields, behaviourComponentFields, t]);

  return {
    TextareaComponent
  };
};

const UiBlock = ({ label, value, rows, autoResize, visible, required, disabled, updateOnChange }: UiComponentProps<TextareaProps>) => {
  return (
    <div className='block-textarea'>
      <UiBlockHeader
        visible={visible}
        label={label}
        required={required}
        disabled={disabled}
        additionalInfo={rows + ' rows'}
        updateOnChange={updateOnChange}
      />
      <div className='block-textarea__input-wrapper'>
        <span className='block-textarea__input'>
          <UiBadge value={value} />
        </span>
        {!autoResize && <div className='resize-icon' />}
      </div>
    </div>
  );
};

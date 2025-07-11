import { type Prettify, type Select } from '@axonivy/form-editor-protocol';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Select.css';
import IconSvg from './Select.svg?react';

type SelectProps = Prettify<Select>;

export const useSelectComponent = () => {
  const { baseComponentFields, behaviourComponentFields, selectItemsComponentFields } = useBase();
  const { t } = useTranslation();

  const SelectComponent = useMemo(() => {
    const SelectComponent: ComponentConfig<SelectProps> = {
      name: 'Select',
      displayName: t('components.select.name'),
      category: 'Elements',
      subcategory: 'Selection',
      icon: <IconSvg />,
      description: t('components.select.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        ...selectItemsComponentFields,
        ...behaviourComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return SelectComponent;
  }, [baseComponentFields, behaviourComponentFields, selectItemsComponentFields, t]);

  return {
    SelectComponent
  };
};

const UiBlock = ({ label, value, visible, required, disabled, updateOnChange }: UiComponentProps<SelectProps>) => (
  <div className='block-input'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
    <div className='block-input__input'>
      <UiBadge value={value} />
      <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
    </div>
  </div>
);

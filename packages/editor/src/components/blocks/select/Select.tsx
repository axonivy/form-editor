import type { Prettify, Select } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Select.css';
import { useBase } from '../base';
import IconSvg from './Select.svg?react';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type SelectProps = Prettify<Select>;

export const useSelectComponent = () => {
  const { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent, selectItemsComponentFields } =
    useBase();
  const { t } = useTranslation();

  const SelectComponent = useMemo(() => {
    const defaultInputProps: Select = {
      label: t('components.select.name'),
      value: '',
      staticItems: [],
      dynamicItemsList: '',
      dynamicItemsLabel: '',
      dynamicItemsValue: '',
      ...defaultBehaviourComponent,
      ...defaultBaseComponent
    } as const;

    const SelectComponent: ComponentConfig<SelectProps> = {
      name: 'Select',
      displayName: t('components.select.name'),
      category: 'Elements',
      subcategory: 'Selection',
      icon: <IconSvg />,
      description: t('components.select.description'),
      defaultProps: defaultInputProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        ...selectItemsComponentFields,
        ...behaviourComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return SelectComponent;
  }, [baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent, selectItemsComponentFields, t]);

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

import { type Checkbox, type Prettify } from '@axonivy/form-editor-protocol';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Checkbox.css';
import IconSvg from './Checkbox.svg?react';

type CheckboxProps = Prettify<Checkbox>;

export const useCheckboxComponent = () => {
  const { t } = useTranslation();
  const { baseComponentFields, updateOnChangeComponentFields } = useBase();

  const CheckboxComponent: ComponentConfig<CheckboxProps> = useMemo(() => {
    const component: ComponentConfig<CheckboxProps> = {
      name: 'Checkbox',
      displayName: t('components.checkbox.name'),
      category: 'Elements',
      subcategory: 'Selection',
      icon: <IconSvg />,
      description: t('components.checkbox.description'),
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
        selected: {
          subsection: 'General',
          label: t('property.selected'),
          type: 'textBrowser',
          browsers: [{ type: 'ATTRIBUTE' }]
        },
        ...updateOnChangeComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return component;
  }, [baseComponentFields, updateOnChangeComponentFields, t]);

  return {
    CheckboxComponent
  };
};

const UiBlock = ({ label, selected, visible, disabled, updateOnChange }: UiComponentProps<CheckboxProps>) => (
  <>
    <UiBlockHeader visible={visible} disabled={disabled} updateOnChange={updateOnChange} />
    <Flex direction='row' gap={1} className='block-checkbox'>
      <div className={`checkbox-button ${selected.toLowerCase() !== 'false' && 'checkbox-checked'}`}>
        {selected.toLowerCase() !== 'false' && <IvyIcon icon={IvyIcons.Check} className='checkbox-icon' />}
      </div>
      <UiBadge value={label} />
    </Flex>
  </>
);

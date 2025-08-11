import type { Checkbox, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Checkbox.css';
import { useBase } from '../base';
import IconSvg from './Checkbox.svg?react';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type CheckboxProps = Prettify<Checkbox>;

export const useCheckboxComponent = () => {
  const { t } = useTranslation();
  const { baseComponentFields, defaultBaseComponent, defaultDisabledComponent, disabledComponentFields } = useBase();

  const defaultCheckboxProps: Checkbox = useMemo(() => {
    return {
      label: t('property.label'),
      selected: 'true',
      ...defaultDisabledComponent,
      updateOnChange: false,
      listener: '',
      ...defaultBaseComponent
    } as const;
  }, [defaultBaseComponent, defaultDisabledComponent, t]);

  const CheckboxComponent: ComponentConfig<CheckboxProps> = useMemo(() => {
    const component: ComponentConfig<CheckboxProps> = {
      name: 'Checkbox',
      displayName: t('components.checkbox.name'),
      category: 'Elements',
      subcategory: 'Selection',
      icon: <IconSvg />,
      description: t('components.checkbox.description'),
      defaultProps: defaultCheckboxProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, ...defaultProps }) => ({ ...defaultCheckboxProps, label, selected: value, ...defaultProps }),
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
        ...disabledComponentFields,
        updateOnChange: { subsection: 'Behaviour', label: t('label.updateFormChange'), type: 'checkbox' },
        listener: {
          subsection: 'Behaviour',
          label: t('label.listener'),
          type: 'textBrowser',
          browsers: [{ type: 'LOGIC' }],
          hide: data => !data.updateOnChange
        }
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return component;
  }, [baseComponentFields, defaultCheckboxProps, disabledComponentFields, t]);

  return {
    defaultCheckboxProps,
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

import { type OrientationType, type Prettify, type Radio } from '@axonivy/form-editor-protocol';
import { Flex, Message } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Radio.css';
import IconSvg from './Radio.svg?react';

type RadioProps = Prettify<Radio>;

export const useRadioComponent = () => {
  const { baseComponentFields, behaviourComponentFields, selectItemsComponentFields } = useBase();
  const { t } = useTranslation();

  const RadioComponent = useMemo(() => {
    const orientationOptions: FieldOption<OrientationType>[] = [
      { label: t('property.horizontal'), value: 'horizontal' },
      { label: t('property.vertical'), value: 'vertical' }
    ] as const;

    const RadioComponent: ComponentConfig<RadioProps> = {
      name: 'Radio',
      displayName: t('components.radio.name'),
      category: 'Elements',
      subcategory: 'Selection',
      icon: <IconSvg />,
      description: t('components.radio.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        ...selectItemsComponentFields,
        orientation: {
          subsection: 'General',
          label: t('components.radio.property.orientation'),
          type: 'select',
          options: orientationOptions
        },
        ...behaviourComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return RadioComponent;
  }, [baseComponentFields, behaviourComponentFields, selectItemsComponentFields, t]);

  return {
    RadioComponent
  };
};

const UiBlock = ({
  label,
  staticItems,
  dynamicItemsList,
  orientation,
  visible,
  required,
  disabled,
  updateOnChange
}: UiComponentProps<RadioProps>) => {
  const { t } = useTranslation();
  return (
    <div className='block-radio'>
      <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
      <Flex
        gap={orientation === 'horizontal' ? 4 : 2}
        direction={orientation === 'horizontal' ? 'row' : 'column'}
        className='block-radio__items'
      >
        {staticItems.map(item => (
          <RadioItem key={item.value} label={item.label} />
        ))}
        {dynamicItemsList !== '' && <RadioItem label={dynamicItemsList} />}
      </Flex>
      {staticItems.length === 0 && dynamicItemsList === '' && <Message variant='warning' message={t('message.noOptionsDefined')} />}
    </div>
  );
};

const RadioItem = ({ label }: { label: string }) => (
  <Flex direction='row' alignItems='center' gap={2} className='block-radio__item'>
    <div className='block-radio__item-indicator' />
    <UiBadge value={label} />
  </Flex>
);

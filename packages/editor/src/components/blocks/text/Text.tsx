import { type Prettify, type Text } from '@axonivy/form-editor-protocol';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Text.css';
import IconSvg from './Text.svg?react';

type TextProps = Prettify<Text>;

export const useTextComponent = () => {
  const { baseComponentFields, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const TextComponent = useMemo(() => {
    const TextComponent: ComponentConfig<TextProps> = {
      name: 'Text',
      displayName: t('components.text.name'),
      category: 'Elements',
      subcategory: 'Text',
      icon: <IconSvg />,
      description: t('components.text.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.content,
      fields: {
        ...baseComponentFields,
        content: { subsection: 'General', label: t('property.content'), type: 'textarea' },
        type: { subsection: 'General', label: t('property.type'), type: 'hidden' },
        icon: { subsection: 'Icon', label: t('property.icon'), type: 'hidden' },
        iconStyle: { subsection: 'Icon', label: t('property.iconStyle'), type: 'hidden' },
        ...visibleComponentField
      }
    };

    return TextComponent;
  }, [baseComponentFields, t, visibleComponentField]);
  return {
    TextComponent
  };
};

const UiBlock = ({ content, icon, iconStyle, visible }: UiComponentProps<TextProps>) => {
  if (icon && iconStyle == 'BLOCK') {
    return (
      <div className='text-icon-wrapper'>
        <IvyIcon icon={IvyIcons.InfoCircle} />
        <div className='block-text'>{content}</div>
      </div>
    );
  }
  return (
    <>
      <UiBlockHeader visible={visible} />
      <div className='block-text'>
        {icon && <IvyIcon icon={IvyIcons.InfoCircle} />}
        <UiBadge value={content} />
      </div>
    </>
  );
};

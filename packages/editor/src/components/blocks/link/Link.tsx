import { type Link, type Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Link.css';
import { useBase } from '../base';
import IconSvg from './Link.svg?react';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type LinkProps = Prettify<Link>;

export const useLinkComponent = () => {
  const { baseComponentFields, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const LinkComponent = useMemo(() => {
    const LinkComponent: ComponentConfig<LinkProps> = {
      name: 'Link',
      displayName: t('components.link.name'),
      category: 'Actions',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.link.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.name,
      fields: {
        ...baseComponentFields,
        name: {
          subsection: 'General',
          label: t('property.name'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        href: { subsection: 'General', label: t('components.link.property.href'), type: 'text' },
        ...visibleComponentField
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return LinkComponent;
  }, [baseComponentFields, t, visibleComponentField]);

  return {
    LinkComponent
  };
};

const UiBlock = ({ name, visible, ...props }: UiComponentProps<LinkProps>) => (
  <>
    <UiBlockHeader visible={visible} />
    <p className='block-link' {...props}>
      <UiBadge value={name} />
    </p>
  </>
);

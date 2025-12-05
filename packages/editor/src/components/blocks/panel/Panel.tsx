import { type Panel, type Prettify } from '@axonivy/form-editor-protocol';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import { type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeaderVisiblePart } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Panel.css';
import IconSvg from './Panel.svg?react';

type PanelProps = Prettify<Panel>;

export const usePanelComponent = () => {
  const { baseComponentFields, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const PanelComponent: ComponentConfig<PanelProps> = useMemo(() => {
    const PanelComponent: ComponentConfig<PanelProps> = {
      name: 'Panel',
      displayName: t('components.panel.name'),
      category: 'Structures',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.panel.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        components: { subsection: 'General', type: 'hidden' },
        label: {
          subsection: 'General',
          label: t('property.title'),
          type: 'textBrowser',
          browsers: [
            { type: 'ATTRIBUTE', options: { overrideSelection: true } },
            { type: 'CMS', options: { overrideSelection: true } }
          ]
        },
        collapsible: { subsection: 'Behaviour', label: t('property.collapsible'), type: 'checkbox' },
        collapsed: {
          subsection: 'Behaviour',
          label: t('property.collapsedDefault'),
          type: 'checkbox',
          options: {},
          hide: data => !data.collapsible
        },
        ...visibleComponentField
      }
    };

    return PanelComponent;
  }, [baseComponentFields, t, visibleComponentField]);

  return {
    PanelComponent
  };
};

const UiBlock = ({ id, components, label, collapsible, collapsed, visible }: UiComponentProps<PanelProps>) => (
  <div className={`i-panel ${collapsible && collapsed ? 'default-collapsed' : ''}`}>
    <div className='i-panel-header'>
      <UiBadge value={label} />
      <Flex gap={1} alignItems='center'>
        <UiBlockHeaderVisiblePart visible={visible} />
        {collapsible ? (
          collapsed ? (
            <IvyIcon icon={IvyIcons.Plus} className={`${collapsible ? '' : 'i-panel-non-collapsible'}`} />
          ) : (
            <svg width='12' height='1.3' viewBox='0 0 13 2' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M1 1L12 1' stroke='#4a4a4a' strokeWidth='1.13' strokeLinecap='round' />
            </svg>
          )
        ) : null}
      </Flex>
    </div>
    {components.map((component, index) => (
      <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} />
    ))}
    <EmptyLayoutBlock id={id} components={components} type='panel' />
  </div>
);

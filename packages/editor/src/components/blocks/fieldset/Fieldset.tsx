import { type Fieldset, type Prettify } from '@axonivy/form-editor-protocol';
import { Flex } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Fieldset.css';
import IconSvg from './Fieldset.svg?react';

type FieldsetProps = Prettify<Fieldset>;

export const useFieldsetComponent = () => {
  const { baseComponentFields, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const FieldsetComponent: ComponentConfig<FieldsetProps> = useMemo(() => {
    const FieldsetComponent: ComponentConfig<FieldsetProps> = {
      name: 'Fieldset',
      displayName: t('components.fieldset.name'),
      category: 'Structures',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.fieldset.description'),
      quickActions: [...DEFAULT_QUICK_ACTIONS, 'EXTRACTINTOCOMPONENT'],
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.legend,
      fields: {
        ...baseComponentFields,
        components: { subsection: 'General', type: 'hidden' },
        legend: {
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
          hide: data => !data.collapsible
        },
        ...visibleComponentField
      }
    };

    return FieldsetComponent;
  }, [baseComponentFields, t, visibleComponentField]);

  return {
    FieldsetComponent
  };
};

const UiBlock = ({ id, components, legend, collapsible, collapsed, visible }: UiComponentProps<FieldsetProps>) => (
  <>
    <UiBlockHeader visible={visible} />
    <fieldset className={`${collapsible ? (collapsed ? 'collapsible default-collapsed' : 'collapsible') : ''}`}>
      <legend>
        <Flex direction='row' alignItems='center' gap={1}>
          {collapsible ? (collapsed ? '+' : '-') : ''}
          <UiBadge value={legend} />
        </Flex>
      </legend>
      {components.map((component, index) => (
        <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} />
      ))}
      <EmptyLayoutBlock id={id} components={components} type='fieldset' />
    </fieldset>
  </>
);

import { type Component, type ComponentData, type Composite, type Prettify } from '@axonivy/form-editor-protocol';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useComponents } from '../../../context/ComponentsContext';
import { useMeta } from '../../../context/useMeta';
import { type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { addDefaults } from '../../component-factory';
import { useBase } from '../base';
import './Composite.css';
import IconSvg from './Composite.svg?react';
import { renderParameters } from './fields/Parameters';
import { renderStartMethodSelect } from './fields/StartMethodSelect';

type CompositeProps = Prettify<Composite>;

export const useCompositeComponent = () => {
  const isComposite = (component?: Component | ComponentData): component is ComponentData & { config: Composite } => {
    return component !== undefined && component.type === 'Composite' && 'name' in component.config && 'startMethod' in component.config;
  };
  const { baseComponentFields } = useBase();
  const { t } = useTranslation();

  const CompositeComponent: ComponentConfig<CompositeProps> = useMemo(() => {
    const CompositeComponent: ComponentConfig<CompositeProps> = {
      name: 'Composite',
      displayName: t('components.composite.name'),
      category: 'Hidden',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.composite.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.name,
      fields: {
        ...baseComponentFields,
        name: { subsection: 'General', label: t('components.composite.name'), type: 'text', options: { disabled: true } },
        startMethod: {
          subsection: 'General',
          label: t('components.composite.property.startMethod'),
          type: 'generic',
          render: renderStartMethodSelect
        },
        parameters: { subsection: 'Parameters', type: 'generic', render: renderParameters }
      }
    } as const;

    return CompositeComponent;
  }, [baseComponentFields, t]);

  return {
    isComposite,
    CompositeComponent
  };
};

const UiBlock = ({ name }: UiComponentProps<CompositeProps>) => {
  const { ui } = useAppContext();
  return (
    <>
      {ui.helpPaddings ? (
        <div className='block-composite'>
          <span>{name}</span>
        </div>
      ) : (
        <CompositeRenderer name={name} />
      )}
    </>
  );
};

const CompositeRenderer = ({ name }: { name: string }) => {
  const { context } = useAppContext();
  const { componentByName } = useComponents();

  const content = useMeta(
    'meta/composite/data',
    { context, compositeId: name },
    {
      data: {
        $schema: 'default',
        components: [],
        config: { title: '', renderer: 'JSF', theme: '', type: 'FORM' }
      }
    }
  ).data;

  return content && content.data.$schema !== 'default' ? (
    content.data.components.map(component => {
      const config = componentByName(component.type);
      const elementConfig = addDefaults('Composite', component.config);
      return <React.Fragment key={component.cid}>{config?.render({ ...elementConfig, id: component.cid })}</React.Fragment>;
    })
  ) : (
    <div className='block-composite'>
      <span>{name}</span>
    </div>
  );
};

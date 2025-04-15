import type { Component, ComponentData, Composite, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Composite.css';
import { useBase } from '../base';
import IconSvg from './Composite.svg?react';
import { renderStartMethodSelect } from './fields/StartMethodSelect';
import { renderParameters } from './fields/Parameters';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { useComponents } from '../../../context/ComponentsContext';

type CompositeProps = Prettify<Composite>;

export const useCompositeComponent = () => {
  const isComposite = (component?: Component | ComponentData): component is ComponentData & { config: Composite } => {
    return component !== undefined && component.type === 'Composite' && 'name' in component.config && 'startMethod' in component.config;
  };
  const { baseComponentFields, defaultBaseComponent } = useBase();
  const { t } = useTranslation();

  const CompositeComponent: ComponentConfig<CompositeProps> = useMemo(() => {
    const defaultCompositeProps: Composite = {
      name: '',
      startMethod: '',
      parameters: {},
      ...defaultBaseComponent
    } as const;

    const CompositeComponent: ComponentConfig<CompositeProps> = {
      name: 'Composite',
      displayName: t('components.composite.name'),
      category: 'Hidden',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.composite.description'),
      defaultProps: defaultCompositeProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, defaultProps }) => ({ ...defaultCompositeProps, name: label, ...defaultProps }),
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
      },
      quickActions: [...DEFAULT_QUICK_ACTIONS, 'OPENCOMPONENT']
    } as const;

    return CompositeComponent;
  }, [baseComponentFields, defaultBaseComponent, t]);

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
    { data: { $schema: '', components: [], config: { renderer: 'JSF', theme: '', type: 'FORM' }, id: '' } }
  ).data;

  return content.data.components.map(component => {
    const config = componentByName(component.type);
    const elementConfig = { ...config.defaultProps, ...component.config };
    return <React.Fragment key={component.cid}>{config.render({ ...elementConfig, id: component.cid })}</React.Fragment>;
  });
};

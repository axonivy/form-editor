import {
  type Layout,
  type LayoutGridVariant,
  type LayoutJustifyContent,
  type LayoutType,
  type Prettify
} from '@axonivy/form-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import { type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import { UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Layout.css';
import IconSvg from './Layout.svg?react';

type LayoutProps = Prettify<Layout>;

export const useLayoutComponent = () => {
  const { baseComponentFields, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const LayoutComponent = useMemo(() => {
    const typeOptions: FieldOption<LayoutType>[] = [
      { label: t('components.layout.grid'), value: 'GRID' },
      { label: t('components.layout.flex'), value: 'FLEX' }
    ] as const;

    const gridVariantOptions: FieldOption<LayoutGridVariant>[] = [
      { label: t('components.layout.column', { count: 1 }), value: 'GRID1' },
      { label: t('components.layout.column', { count: 2 }), value: 'GRID2' },
      { label: t('components.layout.column', { count: 4 }), value: 'GRID4' },
      { label: t('components.layout.free'), value: 'FREE' }
    ] as const;

    const justifyContentOptions: FieldOption<LayoutJustifyContent>[] = [
      { label: t('components.layout.left'), value: 'NORMAL', icon: { icon: IvyIcons.AlignLeft } },
      { label: t('components.layout.spaceBetween'), value: 'SPACE_BETWEEN', icon: { icon: IvyIcons.Straighten } },
      { label: t('components.layout.right'), value: 'END', icon: { icon: IvyIcons.AlignRight } }
    ] as const;

    const LayoutComponent: ComponentConfig<LayoutProps> = {
      name: 'Layout',
      displayName: t('components.layout.name'),
      category: 'Structures',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.layout.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.type,
      fields: {
        ...baseComponentFields,
        components: { subsection: 'General', type: 'hidden' },
        type: { subsection: 'General', label: 'Type', type: 'select', options: typeOptions },
        justifyContent: {
          subsection: 'General',
          type: 'toggleGroup',
          label: t('property.horizontalAlignment'),
          options: justifyContentOptions,
          hide: data => data.type !== 'FLEX'
        },

        gridVariant: {
          subsection: 'General',
          type: 'select',
          label: t('components.layout.property.columns'),
          options: gridVariantOptions,
          hide: data => data.type !== 'GRID'
        },
        ...visibleComponentField
      }
    };

    return LayoutComponent;
  }, [baseComponentFields, t, visibleComponentField]);

  return {
    LayoutComponent
  };
};

const UiBlock = ({ id, components, type, justifyContent, gridVariant, visible }: UiComponentProps<LayoutProps>) => {
  const { ui } = useAppContext();

  return (
    <>
      <UiBlockHeader visible={visible} />
      <div
        className={`block-layout${type === 'GRID' ? ' grid' : ' flex'}${
          justifyContent === 'END' ? ' justify-end' : justifyContent === 'SPACE_BETWEEN' ? ' justify-space_between' : ''
        } ${`${gridVariant.toLocaleLowerCase()}`}`}
        data-responsive-mode={ui.deviceMode}
      >
        {components.map((component, index) => {
          let componentCols = '';
          if (gridVariant === 'FREE') {
            componentCols = `col-span-${component.config.lgSpan ?? '6'} col-md-span-${component.config.mdSpan ?? '12'}`;
          }
          let componentAlignSelf = '';
          if (!(gridVariant === 'GRID1' && type === 'GRID')) {
            componentAlignSelf = getAlignSelfClass(component.config.alignSelf);
          }
          return (
            <ComponentBlock
              key={component.cid}
              component={component}
              preId={components[index - 1]?.cid}
              className={`${componentCols} ${componentAlignSelf}`}
            />
          );
        })}
      </div>
      <EmptyLayoutBlock id={id} components={components} type='layout' />
    </>
  );
};

const getAlignSelfClass = (alignSelf?: string) => {
  if (alignSelf === 'END') return 'align-self-end';
  if (alignSelf === 'CENTER') return 'align-self-center';
  return '';
};

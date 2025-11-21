import './DataTableColumn.css';
import {
  isTable,
  type ActionButtonAlignment,
  type ActionColumnComponent,
  type DataTableColumn,
  type Prettify
} from '@axonivy/form-editor-protocol';
import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import { useBase } from '../base';
import { Flex, IvyIcon, PanelMessage } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBadge, UiBlockHeaderVisiblePart } from '../../UiBlockHeader';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { COLUMN_DROPZONE_ID_PREFIX, getParentComponent, useData } from '../../../data/data';
import { DropZone } from '../../../editor/canvas/DropZone';
import { ActionButtonsField } from './ActionButtonsField';
import { ContentControls } from './controls/ContentControls';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type DataTableColumnProps = Prettify<DataTableColumn>;

export const useDataTableColumnComponent = () => {
  const { baseComponentFields, defaultVisibleComponent, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const DataTableColumnComponent: ComponentConfig<DataTableColumnProps> = useMemo(() => {
    const alignButtonsOptions: FieldOption<ActionButtonAlignment>[] = [
      { label: t('align.top'), value: 'START', icon: { icon: IvyIcons.AlignLeft } },
      { label: t('align.center'), value: 'CENTER', icon: { icon: IvyIcons.AlignHorizontal, rotate: 270 } },
      { label: t('align.bottom'), value: 'END', icon: { icon: IvyIcons.AlignRight } }
    ] as const;

    const defaultDataTableColumnProps: DataTableColumn = {
      header: 'header',
      value: '',
      components: [],
      asActionColumn: false,
      actionColumnAsMenu: false,
      width: '',
      sortable: false,
      filterable: false,
      actionButtonAlignment: 'END',
      ...defaultVisibleComponent
    } as const;

    const component: ComponentConfig<DataTableColumnProps> = {
      name: 'DataTableColumn',
      displayName: t('components.dataTableColumn.name'),
      category: 'Hidden',
      subcategory: 'Input',
      icon: '',
      description: t('components.dataTableColumn.description'),
      defaultProps: defaultDataTableColumnProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, defaultProps }) => ({ ...defaultDataTableColumnProps, header: label, value, ...defaultProps }),
      outlineInfo: component => component.header,
      fields: {
        ...baseComponentFields,
        header: {
          subsection: 'General',
          label: t('components.dataTableColumn.property.header'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        width: {
          subsection: 'General',
          label: t('components.dataTableColumn.property.width'),
          type: 'text',
          options: { placeholder: t('components.dataTableColumn.property.widthPlaceholder') }
        },
        asActionColumn: { subsection: 'General', label: t('components.dataTableColumn.property.actionColumn'), type: 'checkbox' },
        actionButtonAlignment: {
          subsection: 'Content',
          label: t('property.horizontalAlignment'),
          type: 'toggleGroup',
          options: alignButtonsOptions,
          hide: data => !data.asActionColumn
        },
        actionColumnAsMenu: {
          subsection: 'Content',
          label: t('components.dataTableColumn.property.groupActions'),
          type: 'checkbox',
          hide: data => !data.asActionColumn
        },
        components: {
          subsection: 'Content',
          label: t('property.action'),
          type: 'generic',
          render: () => <ActionButtonsField />,
          hide: data => !data.asActionColumn
        },
        value: {
          subsection: 'Content',
          label: t('property.value'),
          type: 'textBrowser',
          browsers: [{ type: 'ATTRIBUTE', options: { withoutEl: true, attribute: { onlyAttributes: 'COLUMN' } } }],
          hide: data => data.asActionColumn
        },
        sortable: { subsection: 'General', label: t('property.enableSorting'), type: 'checkbox', hide: data => data.asActionColumn },
        filterable: {
          subsection: 'General',
          label: t('components.dataTableColumn.property.enableFiltering'),
          type: 'checkbox',
          hide: data => data.asActionColumn
        },

        ...visibleComponentField
      },
      quickActions: ['DELETE', 'DUPLICATE', 'CREATEACTIONCOLUMNBUTTON'],
      subSectionControls: (props, subSection) => (subSection === 'Content' ? <ContentControls {...props} /> : null)
    };

    return component;
  }, [baseComponentFields, defaultVisibleComponent, t, visibleComponentField]);

  return {
    DataTableColumnComponent
  };
};

const UiBlock = ({
  id,
  header,
  value,
  sortable,
  filterable,
  visible,
  components,
  asActionColumn,
  actionColumnAsMenu,
  actionButtonAlignment
}: UiComponentProps<DataTableColumnProps>) => {
  const { t } = useTranslation();
  const { data } = useData();
  const parentTable = getParentComponent(data.components, id);
  return (
    <div className='block-column'>
      <div className='block-column__head'>
        <Flex justifyContent='space-between' direction='column' gap={2}>
          <Flex direction='row' alignItems='center' gap={2} justifyContent='space-between'>
            <Flex alignItems='center' gap={2}>
              <UiBadge value={header} />
              {sortable && !asActionColumn && <IvyIcon icon={IvyIcons.Selector} />}
            </Flex>
            <Flex alignItems='center' gap={2}>
              {isTable(parentTable) &&
                parentTable.config.isEditable &&
                parentTable.config.addButton &&
                parentTable.config.components[parentTable.config.components.length - 1].cid === id && <i className='pi pi-plus' />}
              <UiBlockHeaderVisiblePart visible={visible} />
            </Flex>
          </Flex>
          <Flex className='block-column__filter' data-active={filterable && !asActionColumn} gap={1}>
            {t('label.filterBy')} {filterable && !asActionColumn && <UiBadge value={header} />}
          </Flex>
        </Flex>
      </div>
      <div className='block-column__body' style={asActionColumn ? { justifySelf: actionButtonAlignment.toLowerCase() } : undefined}>
        {asActionColumn ? (
          components.length > 0 ? (
            actionColumnAsMenu ? (
              <ButtonMenu>
                <Flex direction={'column'} gap={1} className='block-column__buttons' style={{ border: 'var(--basic-border)' }}>
                  {renderActionButtons(components)}
                </Flex>
              </ButtonMenu>
            ) : (
              <Flex direction={'row'} gap={1} className='block-column__buttons'>
                {renderActionButtons(components)}
              </Flex>
            )
          ) : (
            <EmptyActionColumnBlock components={components} id={id} type='Action Column' />
          )
        ) : (
          <span>{value?.length === 0 || value === 'variable' ? t('label.useEntireObj') : value}</span>
        )}
      </div>
    </div>
  );
};

const EmptyActionColumnBlock = ({ id, components, type }: { id: string; components: Array<ActionColumnComponent>; type: string }) => {
  const { t } = useTranslation();
  return (
    <DropZone id={`${COLUMN_DROPZONE_ID_PREFIX}${id}`} preId={components[components.length - 1]?.cid}>
      {components.length === 0 ? (
        <PanelMessage message={t('label.dragFirstButton', { type: type })} mode='row' className='drag-hint row' />
      ) : (
        <div className='empty-block for-layout' />
      )}
    </DropZone>
  );
};

const ButtonMenu = ({ children }: { children: React.ReactNode }) => {
  const { ui } = useAppContext();
  const { t } = useTranslation();
  return ui.helpPaddings ? (
    <>
      <div className='block-button button-menu-header' style={{ borderRadius: '5px 5px 0px 0px' }} data-variant='primary'>
        <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
        {t('property.actions')}
      </div>
      {children}
    </>
  ) : (
    <div className='block-button button-menu-header' data-variant='primary'>
      <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
      <div>{t('property.actions')}</div>
    </div>
  );
};

const renderActionButtons = (components: ActionColumnComponent[]) =>
  components.map((button, index) => {
    const actionButton: ActionColumnComponent = { ...button };
    return (
      <ComponentBlock
        key={`${COLUMN_DROPZONE_ID_PREFIX}${actionButton.cid}`}
        component={{ ...actionButton, cid: `${actionButton.cid}` }}
        preId={components[index - 1]?.cid}
      />
    );
  });

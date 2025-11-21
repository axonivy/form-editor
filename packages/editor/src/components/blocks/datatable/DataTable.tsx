import type { DataTable, Prettify, TableComponent } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './DataTable.css';
import { useBase } from '../base';
import IconSvg from './DataTable.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { useAppContext } from '../../../context/AppContext';
import { Button, cn, Flex, Message } from '@axonivy/ui-components';
import { useMeta } from '../../../context/useMeta';
import { type ComponentByName } from '../../components';
import { createInitTableColumns, findComponentDeep, modifyData } from '../../../data/data';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBlockHeader } from '../../UiBlockHeader';
import { ColumnControl } from './controls/ColumnControl';
import { ColumnsField } from './fields/ColumnsField';
import { renderEditableDataTableField } from './fields/EditableDataTableField';
import { useTranslation } from 'react-i18next';
import { findAttributesOfType } from '../../../editor/browser/data-class/variable-tree-data';
import { useMemo } from 'react';
import { useComponents } from '../../../context/ComponentsContext';

type DataTableProps = Prettify<DataTable>;

const DIALOG_TYPE = 'Dialog';

export const useDataTableComponent = (componentByName: ComponentByName) => {
  const { baseComponentFields, defaultBaseComponent, defaultVisibleComponent, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const DataTableComponent = useMemo(() => {
    const defaultDataTableProps: DataTable = {
      components: [],
      value: '',
      isEditable: false,
      addButton: false,
      editDialogId: '',
      paginator: false,
      resizableColumns: true,
      maxRows: '10',
      ...defaultVisibleComponent,
      ...defaultBaseComponent
    } as const;

    const component: ComponentConfig<DataTableProps> = {
      name: 'DataTable',
      displayName: t('components.dataTable.name'),
      category: 'Elements',
      subcategory: 'Input',
      icon: <IconSvg />,
      description: t('components.dataTable.description'),
      defaultProps: defaultDataTableProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, ...defaultProps }) => ({ ...defaultDataTableProps, label, value, ...defaultProps }),
      outlineInfo: component => component.value,
      fields: {
        ...baseComponentFields,
        value: {
          subsection: 'General',
          label: t('label.listOfObjects'),
          type: 'textBrowser',
          browsers: [{ type: 'ATTRIBUTE', options: { attribute: { typeHint: 'List' } } }]
        },
        isEditable: {
          subsection: 'General',
          label: t('components.dataTable.property.editable'),
          type: 'generic',
          render: renderEditableDataTableField
        },
        addButton: {
          subsection: 'General',
          label: t('components.dataTable.property.addButton'),
          type: 'checkbox',
          hide: data => !data.isEditable
        },
        editDialogId: { subsection: 'General', label: t('components.dataTable.property.editDialog'), type: 'hidden' },
        resizableColumns: {
          subsection: 'Columns',
          label: t('components.dataTable.property.resizableColumns'),
          type: 'checkbox'
        },
        components: {
          subsection: 'Columns',
          label: t('property.objectBoundColumns'),
          type: 'generic',
          render: () => <ColumnsField />
        },
        paginator: { subsection: 'Paginator', label: t('components.dataTable.property.enablePaginator'), type: 'checkbox' },
        maxRows: {
          subsection: 'Paginator',
          label: t('components.dataTable.property.rowsPerPage'),
          type: 'number',
          hide: data => !data.paginator
        },
        ...visibleComponentField
      },
      quickActions: ['DELETE', 'DUPLICATE', 'CREATECOLUMN', 'CREATEACTIONCOLUMN'],
      subSectionControls: (props, subSection) => (subSection === 'Columns' ? <ColumnControl {...props} /> : null),
      onDelete: (component, setData) => {
        if (component.editDialogId.length > 0) {
          setData(oldData => modifyData(oldData, { type: 'remove', data: { id: component.editDialogId } }, componentByName).newData);
        }
      }
    };

    return component;
  }, [baseComponentFields, componentByName, defaultBaseComponent, defaultVisibleComponent, t, visibleComponentField]);

  return { DataTableComponent };
};

const UiBlock = ({ id, components, value, paginator, maxRows, visible, editDialogId }: UiComponentProps<DataTableProps>) => {
  const { t } = useTranslation();
  const { componentByName } = useComponents();
  const { data, setSelectedElement, selectedElement, ui } = useAppContext();
  const dialog = findComponentDeep(data.components, editDialogId);

  return (
    <Flex direction='column' gap={2} className='block-table'>
      <Flex direction='column' gap={4}>
        {!ui.helpPaddings && (
          <UiBlockHeader visible={visible} additionalInfo={paginator ? t('label.nRowsPerPage', { rows: maxRows }) : ''} />
        )}

        {components.length > 0 && (
          <Flex direction='row' gap={1} className='block-table__columns'>
            {components.map((column, index) => {
              const columnComponent: TableComponent = { ...column };
              const hasWidth = Boolean(column.config.width && !ui.helpPaddings);
              const minWidth = /^[0-9]+$/.test(column.config.width) ? `${column.config.width}px` : column.config.width;
              const allColumnsHaveWidth = hasWidth && components.every(col => col.config.width.length > 0);
              const flex = allColumnsHaveWidth ? `${parseInt(column.config.width.replace(/[^\d]/g, ''), 10) || 1} 1 0` : undefined;
              return (
                <ComponentBlock
                  key={column.cid}
                  component={columnComponent}
                  preId={components[index - 1]?.cid}
                  style={{ minWidth: hasWidth ? minWidth : undefined, flex: flex ? flex : hasWidth ? undefined : '1 1 auto' }}
                />
              );
            })}
          </Flex>
        )}
        {components.length === 0 && <EmptyDataTableColumn id={id} initValue={value} />}
      </Flex>
      {paginator && (
        <Flex direction='column' alignItems='center'>
          <Flex className='block-table__paginator' direction='row' alignItems='center' gap={2}>
            <div className='arrow'>«</div>
            <div className='arrow'>‹</div>
            <div className='page-item-active'>1</div>
            <div className='page-item'>2</div>
            <div className='page-item'>3</div>
            <div className='arrow'>›</div>
            <div className='arrow'>»</div>
          </Flex>
        </Flex>
      )}
      {dialog && ui.helpPaddings && (
        <div
          className={cn('draggable', 'block-table__dialog', selectedElement === editDialogId && 'selected')}
          style={{ boxShadow: 'var(--editor-shadow)' }}
          onClick={e => {
            e.stopPropagation();
            setSelectedElement(editDialogId);
          }}
        >
          {componentByName(DIALOG_TYPE).render({ ...dialog.data[dialog.index].config, id: editDialogId })}
        </div>
      )}
    </Flex>
  );
};

const EmptyDataTableColumn = ({ id, initValue }: { id: string; initValue: string }) => {
  const { t } = useTranslation();
  const { componentByName } = useComponents();
  const { context, setData } = useAppContext();
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;

  if (initValue.length === 0) {
    return <Message variant='warning' message={t('components.dataTable.valueEmpty')} />;
  }

  const createColumns = () => {
    const tree = findAttributesOfType(dataClass, initValue, 10, 'row');
    const isLeafNode = tree[0].children.length === 0;
    const mappableBrowserNode = isLeafNode ? tree : tree[0].children;
    setData(data => {
      const creates = mappableBrowserNode
        .map(attribute => {
          const component = componentByName('DataTableColumn');
          if (component === undefined) {
            return undefined;
          }
          return {
            componentName: component.name,
            label: isLeafNode && attribute.data ? attribute.data.attribute : attribute.value,
            value: isLeafNode ? '' : attribute.value
          };
        })
        .filter(create => create !== undefined);
      return createInitTableColumns(id, data, creates, componentByName);
    });
  };

  return (
    <Button icon={IvyIcons.DatabaseLink} variant='outline' onClick={createColumns}>
      {t('components.dataTable.columnFromValue')}
    </Button>
  );
};

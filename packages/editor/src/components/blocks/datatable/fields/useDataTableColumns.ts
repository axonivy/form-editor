import { isTable, type DataTableColumn, type Variable } from '@axonivy/form-editor-protocol';

import type { BrowserNode } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useAppContext } from '../../../../context/AppContext';
import { useMeta } from '../../../../context/useMeta';
import { useData } from '../../../../data/data';
import { variableTreeData } from '../../../../editor/browser/data-class/variable-tree-data';
import { stripELExpression } from '../../../../utils/string';
import { createComponent } from '../../../component-factory';
import type { ColumnItem } from './ColumnsField';

export const useDataTableColumns = () => {
  const { context } = useAppContext();
  const { element } = useData();

  const variableInfo = useMeta(
    'meta/data/attributes',
    { context, dataClassField: isTable(element) ? stripELExpression(element.config.value) : '', rootVariable: 'currentRow' },
    { types: {}, variables: [] }
  ).data;

  const activeColumns = useMemo(
    () =>
      isTable(element)
        ? element.config.components.map<ColumnItem>(c => ({
            ...c.config,
            columnCid: c.cid
          }))
        : [],
    [element]
  );

  const convertBrowserNodesToColumns = (nodes: Array<BrowserNode<Variable>>): DataTableColumn[] => {
    return nodes.flatMap(node => {
      if (node.children.length === 0) {
        return [createComponent('DataTableColumn', { label: node.data?.attribute ?? '', value: '#{currentRow}' })];
      }
      return node.children.map(childNode =>
        createComponent('DataTableColumn', { label: childNode.value, value: '#{currentRow.' + childNode.value + '}' })
      );
    });
  };

  const boundColumns = convertBrowserNodesToColumns(variableTreeData().of(variableInfo));

  const boundInactiveColumns = useMemo(() => {
    return boundColumns.filter(boundCol => !activeColumns.some(activeCol => activeCol.value === boundCol.value));
  }, [boundColumns, activeColumns]);

  return {
    boundColumns,
    activeColumns,
    boundInactiveColumns
  };
};

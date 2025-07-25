import {
  isColumn,
  isDialog,
  isTable,
  type ComponentData,
  type FormData,
  type SelectItemsProps,
  type Variable
} from '@axonivy/form-editor-protocol';
import { Message, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Row } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { findComponentDeep, getParentComponent, useData } from '../../../data/data';
import { stripELExpression } from '../../../utils/string';
import type { BrowserOptions, OnlyAttributeSelection } from '../Browser';
import { fullVariablePath, variableTreeData } from './variable-tree-data';

export const ATTRIBUTE_BROWSER_ID = 'Attribute';

export const useAttributeBrowser = (options?: BrowserOptions): Browser => {
  const { t } = useTranslation();
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const { context } = useAppContext();
  const { element, data } = useData();
  const { field, rootVariable } = determineAttributesContextField(element, data, options?.attribute?.onlyAttributes);
  const variableInfo = useMeta(
    'meta/data/attributes',
    { context, dataClassField: stripELExpression(field), rootVariable },
    { types: {}, variables: [] }
  ).data;

  useEffect(() => {
    const treeData = variableTreeData().of(variableInfo);
    setTree(options?.attribute?.onlyObjects ? filterNodesWithChildren(treeData) : treeData);
  }, [options?.attribute?.onlyObjects, variableInfo]);

  const loadChildren = useCallback<(row: BrowserNode) => void>(
    row => setTree(tree => variableTreeData().loadChildrenFor(variableInfo, row.info, tree)),
    [variableInfo, setTree]
  );
  const browser = useBrowser(tree, { loadChildren: row => loadChildren(row.original) });

  return {
    name: ATTRIBUTE_BROWSER_ID,
    icon: IvyIcons.Attribute,
    browser,
    header: options?.attribute?.typeHint ? (
      <Message variant='info' message={t('message.typeDefinedBy', { type: options.attribute.typeHint })} />
    ) : undefined,
    infoProvider: row => row?.original.info,
    applyModifier: row => getApplyModifierValue(row, options?.attribute?.onlyAttributes)
  };
};

export const getApplyModifierValue = (row: Row<BrowserNode<unknown>> | undefined, options?: OnlyAttributeSelection): { value: string } => {
  return { value: !row ? '' : fullVariablePath(row, options?.type !== 'COLUMN') };
};
export const filterNodesWithChildren = (nodes: Array<BrowserNode<Variable>>): Array<BrowserNode<Variable>> => {
  return nodes
    .filter(node => node.children && node.children.length > 0)
    .map(node => ({
      ...node,
      children: filterNodesWithChildren(node.children)
    }));
};

const determineAttributesContextField = (element: ComponentData | undefined, data: FormData, options?: OnlyAttributeSelection) => {
  let field = '';
  let rootVariable = options?.root ?? 'data';
  if (element !== undefined) {
    const parentComponent = getParentComponent(data.components, element.cid);
    switch (options?.type) {
      case 'DYNAMICLIST':
        field = (element.config as SelectItemsProps).dynamicItemsList;
        break;
      case 'COLUMN':
        if (parentComponent && isTable(parentComponent)) {
          field = parentComponent.config.value;
        }
        break;
      default:
        if (isColumn(parentComponent)) {
          const parentTableComponent = getParentComponent(data.components, parentComponent.cid);
          field = isTable(parentTableComponent) ? parentComponent.config?.value : '';
          break;
        } else if (isDialog(parentComponent)) {
          rootVariable = 'currentRow';
          const dataTable = findComponentDeep(data.components, parentComponent.config?.linkedComponent);
          const table = dataTable ? dataTable.data[dataTable.index] : undefined;
          if (table && isTable(table)) {
            field = table.config.value;
          }
          break;
        }
    }
  }
  return { field, rootVariable };
};

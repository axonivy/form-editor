import { Message, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../context/useMeta';
import { useCallback, useEffect, useState } from 'react';
import {
  isTable,
  type ComponentData,
  type ConfigData,
  type Dialog,
  type FormData,
  type Variable,
  type VariableInfo
} from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../context/AppContext';
import { findComponentDeep, getParentComponent, useData } from '../../../data/data';
import type { BrowserOptions } from '../Browser';
import { findAttributesOfType, variableTreeData, fullVariablePath } from './variable-tree-data';
import { stripELExpression } from '../../../utils/string';
import { useTranslation } from 'react-i18next';

export const ATTRIBUTE_BROWSER_ID = 'Attribute' as const;

export const useAttributeBrowser = (options?: BrowserOptions): Browser => {
  const { t } = useTranslation();
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const [componentInDialog, setComponentInDialog] = useState(false);
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const { element, data } = useData();

  useEffect(() => {
    const treeData = determineTreeData(element, data, variableInfo, options, setComponentInDialog);
    setTree(options?.attribute?.onlyObjects ? filterNodesWithChildren(treeData) : treeData);
  }, [data, data.components, element, options, variableInfo]);

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
    applyModifier: row => getApplyModifierValue(row, componentInDialog, options)
  };
};

export const getApplyModifierValue = (
  row: Row<BrowserNode<unknown>> | undefined,
  componentInDialog: boolean,
  options?: BrowserOptions
): { value: string } => {
  if (!row) {
    return { value: '' };
  }
  const path = fullVariablePath(row, (componentInDialog || options?.attribute?.onlyAttributes) && false);

  const hasParent = typeof row.getParentRow === 'function' && row.getParentRow();
  const prefix = hasParent ? (componentInDialog ? 'currentRow' : options?.attribute?.onlyAttributes === 'DYNAMICLIST' ? 'item' : '') : '';

  return {
    value: `${prefix}${prefix && path ? '.' : ''}${path}`
  };
};
export const filterNodesWithChildren = (nodes: Array<BrowserNode<Variable>>): Array<BrowserNode<Variable>> => {
  return nodes
    .filter(node => node.children && node.children.length > 0)
    .map(node => ({
      ...node,
      children: filterNodesWithChildren(node.children)
    }));
};

const determineTreeData = (
  element: ComponentData | undefined,
  data: FormData,
  variableInfo: VariableInfo,
  options?: BrowserOptions,
  setComponentInDialog?: (value: boolean) => void
): Array<BrowserNode<Variable>> => {
  if (!element) {
    return variableTreeData().of(variableInfo);
  }

  const parentComponent = getParentComponent(data.components, element.cid);
  switch (options?.attribute?.onlyAttributes) {
    case 'DYNAMICLIST':
      return findAttributesOfType(variableInfo, (element.config as ConfigData).dynamicItemsList as string);
    case 'COLUMN':
      if (parentComponent && isTable(parentComponent)) {
        return findAttributesOfType(variableInfo, parentComponent.config.value || '', 10, 'row');
      }
      break;
    default:
      if (parentComponent?.type === 'DataTableColumn') {
        const parentTableComponent = getParentComponent(data.components, parentComponent.cid);
        return [
          ...findAttributesOfType(variableInfo, isTable(parentTableComponent) ? parentComponent.config.value : '', 10, 'row'),
          ...variableTreeData().of(variableInfo)
        ];
      } else if (parentComponent?.type === 'Dialog') {
        setComponentInDialog?.(true);
        const dataTable = findComponentDeep(data.components, (parentComponent.config as unknown as Dialog)?.linkedComponent);
        const table = dataTable ? dataTable.data[dataTable.index] : undefined;
        if (table && isTable(table)) {
          return findAttributesOfType(variableInfo, stripELExpression(table.config.value), 10, 'currentRow');
        }
      } else {
        return variableTreeData().of(variableInfo);
      }
  }
  return variableTreeData().of(variableInfo);
};

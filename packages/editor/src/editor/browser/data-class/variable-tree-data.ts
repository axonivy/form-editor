import type { ComponentType, Variable, VariableInfo } from '@axonivy/form-editor-protocol';
import { labelText, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Row } from '@tanstack/react-table';
import { componentForDataType, type CreateData } from '../../../components/component-factory';
import { filterNodesWithChildren } from './useAttributeBrowser';

export const variableTreeData = () => {
  const of = (paramInfo: VariableInfo): Array<BrowserNode<Variable>> => {
    return paramInfo.variables.map(param => ({
      value: param.attribute,
      info: param.type,
      icon: IvyIcons.Attribute,
      data: param,
      children: typesOfParam(paramInfo, param.type, [param.type]),
      isLoaded: true
    }));
  };

  const loadChildrenFor = (
    paramInfo: VariableInfo,
    paramType: string,
    tree: Array<BrowserNode<Variable>>
  ): Array<BrowserNode<Variable>> => {
    return tree.map(node => {
      if (node.isLoaded === false && node.info === paramType) {
        node.children = typesOfParam(paramInfo, paramType, [paramType]);
        node.isLoaded = true;
      } else {
        loadChildrenFor(paramInfo, paramType, node.children);
      }
      return node;
    });
  };

  const typesOfParam = (paramInfo: VariableInfo, paramType: string, checkParamTypes: Array<string> = []): Array<BrowserNode<Variable>> =>
    paramInfo.types[paramType]?.map(type => {
      const data = {
        value: type.attribute,
        info: type.type,
        icon: IvyIcons.Attribute,
        data: type,
        children: [] as Array<BrowserNode<Variable>>,
        isLoaded: paramInfo.types[type.type] === undefined
      };
      if (data.isLoaded === false && !checkParamTypes.includes(type.type)) {
        data.children = typesOfParam(paramInfo, type.type, [...checkParamTypes, type.type]);
        data.isLoaded = true;
      }
      return data;
    }) ?? [];

  return { of, loadChildrenFor, typesOfParam };
};

export const collectNodesWithChildren = (nodes: BrowserNode<Variable>[]): BrowserNode<Variable>[] => {
  const filteredNodes = filterNodesWithChildren(nodes);
  return flattenBrowserNodes(filteredNodes);
};

export const flattenBrowserNodes = (nodes: BrowserNode<Variable>[], parent?: string): BrowserNode<Variable>[] => {
  let result: BrowserNode<Variable>[] = [];
  for (const node of nodes) {
    const adjustedNode: BrowserNode<Variable> = {
      ...node,
      value: parent ? `${parent}.${node.value}` : node.value,
      children: []
    };
    result.push(adjustedNode);
    if (node.children && node.children.length > 0) {
      result = [...result, ...flattenBrowserNodes(node.children, adjustedNode.value)];
    }
  }
  return result;
};

export const fullVariablePath = (row: Row<BrowserNode>, showRootNode: boolean = true): string => {
  const parentRows = row.getParentRows();
  const isFlatStructure = parentRows.length === 0;
  const relevantParents = showRootNode || isFlatStructure ? parentRows : parentRows.slice(1);

  const parentPath = relevantParents.map(parent => parent.original.value).join('.');

  if ((row.original.value === 'variable' || row.original.value === 'row') && !showRootNode) {
    return '';
  }
  return parentPath ? `${parentPath}.${row.original.value}` : row.original.value;
};

export const rowToCreateData = (row: Row<BrowserNode>): { type: ComponentType; config: CreateData } | undefined => {
  const node = row.original;
  const { type, config } = componentForDataType(node.info);
  if (type === undefined) {
    return undefined;
  }
  const variablePath = fullVariablePath(row);
  return {
    type,
    config: {
      label: labelText(node.value),
      value: `#{${variablePath}}`,
      ...config
    }
  };
};

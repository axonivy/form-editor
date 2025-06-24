import type { DeepPartial, Variable, VariableInfo } from '@axonivy/form-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';
import {
  collectNodesWithChildren,
  findAttributesOfType,
  formatVariableValue,
  fullVariablePath,
  rowToCreateData,
  variableTreeData
} from './variable-tree-data';

const variableInfo: VariableInfo = {
  variables: [
    {
      attribute: 'param.procurementRequest',
      type: 'workflow.humantask.ProcurementRequest',
      simpleType: 'ProcurementRequest',
      description: ''
    }
  ],
  types: {
    'workflow.humantask.ProcurementRequest': [
      {
        attribute: 'accepted',
        type: 'Boolean',
        simpleType: 'Boolean',
        description: ''
      },
      {
        attribute: 'amount',
        type: 'Number',
        simpleType: 'Number',
        description: ''
      },
      {
        attribute: 'requester',
        type: 'workflow.humantask.User',
        simpleType: 'User',
        description: ''
      }
    ],
    'workflow.humantask.User': [
      {
        attribute: 'email',
        type: 'String',
        simpleType: 'String',
        description: ''
      }
    ]
  }
};

const endlessParamInfo: VariableInfo = {
  variables: [
    {
      attribute: 'param.Endless',
      type: 'demo.Endless',
      simpleType: 'Endless',
      description: ''
    }
  ],
  types: {
    'demo.Endless': [
      {
        attribute: 'endless',
        type: 'demo.Endless',
        simpleType: 'Endless',
        description: ''
      },
      {
        attribute: 'endlessList',
        type: 'List<demo.Endless>',
        simpleType: 'List<demo.Endless>',
        description: ''
      },
      {
        attribute: 'something',
        type: 'String',
        simpleType: 'String',
        description: ''
      }
    ]
  }
};

describe('variableTreeData', () => {
  test('of', () => {
    const tree = variableTreeData().of(variableInfo);
    expect(tree).toHaveLength(1);
    expect(tree[0].value).equals('param.procurementRequest');
    expect(tree[0].children).toHaveLength(3);
    expect(tree[0].children[0].value).equals('accepted');
    expect(tree[0].children[1].value).equals('amount');
    expect(tree[0].children[2].value).equals('requester');
    expect(tree[0].children[2].isLoaded).toBeTruthy();
    expect(tree[0].children[2].children).toHaveLength(1);
    expect(tree[0].children[2].children[0].value).equals('email');
  });

  test('of endless', () => {
    const tree = variableTreeData().of(endlessParamInfo);
    expect(tree[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(endlessParamInfo, 'demo.Endless', tree);
    expect(tree[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].children[0].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(endlessParamInfo, 'demo.Endless', tree);
    expect(tree[0].children[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].children[0].children[0].isLoaded).toBeFalsy();
  });

  test('of endless', () => {
    const tree = variableTreeData().of(endlessParamInfo);
    expect(tree[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(endlessParamInfo, 'demo.Endless', tree);
    expect(tree[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].children[0].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(endlessParamInfo, 'demo.Endless', tree);
    expect(tree[0].children[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].children[0].children[0].isLoaded).toBeFalsy();
  });
});

test('findAttributesOfType of List<demo.Endless>', () => {
  const list = findAttributesOfType(endlessParamInfo, 'param.Endless.endlessList');
  expect(list.length).toEqual(1);
  expect(list[0].value).toEqual('item');
  expect(list[0].info).toEqual('demo.Endless');
  expect(list[0].children[0].value).toEqual('endless');
  expect(list[0].children[0].info).toEqual('demo.Endless');
  expect(list[0].children[2].value).toEqual('something');
  expect(list[0].children[2].info).toEqual('String');
});

const row = {
  original: { value: 'country', info: 'String' },
  getParentRows: () => [{ original: { value: 'data' } }, { original: { value: 'address' } }, { original: { value: 'location' } }]
} as Row<BrowserNode>;

test('fullVariablePath', () => {
  expect(fullVariablePath(row)).toEqual('data.address.location.country');
});

test('fullVariablePath dontShowRootNode', () => {
  expect(fullVariablePath(row, false)).toEqual('address.location.country');
});

test('rowToCreateData', () => {
  expect(rowToCreateData({ original: { value: 'country', info: 'java.util.List' } } as Row<BrowserNode>)).toEqual(undefined);
  expect(rowToCreateData(row)).toEqual({
    type: 'Input',
    config: {
      label: 'Country',
      value: '#{data.address.location.country}'
    }
  });
});

test('return the variable path wrapped in #{ } when no prefix is provided', () => {
  expect(formatVariableValue('some.path')).toBe('#{some.path}');
});

test('prepend prefix when given', () => {
  expect(formatVariableValue('some.path', 'prefix')).toBe('#{prefix.some.path}');
});

test('return only the prefix when variablePath is empty', () => {
  expect(formatVariableValue('', 'prefix')).toBe('#{prefix}');
});

test('return an empty #{ } when both prefix and variablePath are empty', () => {
  expect(formatVariableValue('')).toBe('#{}');
});

describe('collectNodesWithChildren', () => {
  test('returns empty array for empty input', () => {
    const result = collectNodesWithChildren([]);
    expect(result).toEqual([]);
  });

  test('collects single-level nodes with children', () => {
    const nodes: DeepPartial<BrowserNode<Variable>>[] = [
      {
        value: 'parent',
        children: [{ value: 'child1', children: [] }]
      }
    ];
    const result = collectNodesWithChildren(nodes as BrowserNode<Variable>[]);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('parent');
  });

  test('collects nested nodes with adjusted values', () => {
    const nodes: DeepPartial<BrowserNode<Variable>>[] = [
      {
        value: 'root',
        children: [
          {
            value: 'child',
            children: [{ value: 'subchild', children: [] }]
          }
        ]
      }
    ];
    const result = collectNodesWithChildren(nodes as BrowserNode<Variable>[]);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('root');
    expect(result[1].value).toBe('root.child');
  });

  test('handles mixed nodes (some with children, some without)', () => {
    const nodes: DeepPartial<BrowserNode<Variable>>[] = [
      {
        value: 'root1',
        children: []
      },
      {
        value: 'root2',
        children: [
          {
            value: 'child2',
            children: []
          }
        ]
      }
    ];
    const result = collectNodesWithChildren(nodes as BrowserNode<Variable>[]);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('root2');
  });
});

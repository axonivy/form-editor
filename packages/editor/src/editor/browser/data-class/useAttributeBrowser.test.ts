import type { DeepPartial, Variable } from '@axonivy/form-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';
import { expect } from 'vitest';
import { filterNodesWithChildren, getApplyModifierValue } from './useAttributeBrowser';

const row = {
  original: { value: 'country', info: 'String' },
  getParentRow: () => ({ original: { value: 'data' } }) as Row<BrowserNode>,
  getParentRows: () => [{ original: { value: 'data' } }, { original: { value: 'address' } }, { original: { value: 'location' } }]
} as Row<BrowserNode>;

test('return empty value when row is undefined', () => {
  const result = getApplyModifierValue(undefined);
  expect(result).toEqual({ value: '' });
});

test('returns full variable path when row is defined and componentInDialog is false', () => {
  const result = getApplyModifierValue(row);
  expect(result).toEqual({ value: 'data.address.location.country' });
});

test('returns partial path when onlyAttributes is COLUMN and componentInDialog is false', () => {
  const result = getApplyModifierValue(row, { type: 'COLUMN', root: '' });
  expect(result).toEqual({ value: 'address.location.country' });
});

test('returns rootonly prefix when row has no parents and componentInDialog is true', () => {
  const result = getApplyModifierValue({
    original: { value: 'currentRow', info: 'String' },
    getParentRow: () => undefined,
    getParentRows: () => []
  } as unknown as Row<BrowserNode>);
  expect(result).toEqual({ value: 'currentRow' });
});

test('returns only row value when onlyAttributes is COLUMN and row has no parents', () => {
  const result = getApplyModifierValue(
    {
      original: { value: 'data', info: 'String' },
      getParentRows: () => [{}]
    } as Row<BrowserNode>,
    { type: 'COLUMN', root: '' }
  );
  expect(result).toEqual({ value: 'data' });
});

const mockNode = (value: string, children: DeepPartial<BrowserNode<Variable>>[] = []): DeepPartial<BrowserNode<Variable>> => ({
  value,
  children
});

test('filters out nodes without children', () => {
  const nodes = [mockNode('A'), mockNode('B', [mockNode('B1')])];
  const result = filterNodesWithChildren(nodes as BrowserNode<Variable>[]);
  expect(result).toHaveLength(1);
  expect(result[0].value).toBe('B');
});

test('recursively filters nested nodes', () => {
  const nodes = [mockNode('A', [mockNode('A1'), mockNode('A2', [mockNode('A2a'), mockNode('A2b')])]), mockNode('B')];
  const result = filterNodesWithChildren(nodes as BrowserNode<Variable>[]);
  expect(result).toHaveLength(1);
  expect(result[0].value).toBe('A');
  expect(result[0].children).toHaveLength(1);
  expect(result[0].children[0].value).toBe('A2');
});

test('returns only top-level nodes with children', () => {
  const nodes = [mockNode('X', [mockNode('X1')]), mockNode('Y'), mockNode('Z', [mockNode('Z1', [mockNode('Z1a')])])];
  const result = filterNodesWithChildren(nodes as BrowserNode<Variable>[]);
  expect(result).toHaveLength(2);
  const values = result.map(n => n.value);
  expect(values).toContain('X');
  expect(values).toContain('Z');
});

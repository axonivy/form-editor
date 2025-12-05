import type { ButtonType, ComponentData, DeepPartial } from '@axonivy/form-editor-protocol';
import { describe, expect } from 'vitest';
import { DEFAULT_QUICK_ACTIONS, getQuickActions, isDataTableEditableButtons, isDialogButton } from './component-quickaction-registry';

const mockButton = (type: ButtonType): DeepPartial<ComponentData> => ({
  cid: 'button1',
  type: 'Button',
  config: { type }
});

const mockColumn = (asActionColumn: boolean): DeepPartial<ComponentData> => ({
  cid: 'col1',
  type: 'DataTableColumn',
  config: { asActionColumn }
});

describe('getQuickActions', () => {
  test('returns [] for dialog buttons', () => {
    expect(getQuickActions(mockButton('DIALOGCANCEL') as ComponentData)).toEqual([]);
    expect(getQuickActions(mockButton('DIALOGSAVE') as ComponentData)).toEqual([]);
  });

  test('returns DELETE for editable datatable buttons', () => {
    expect(getQuickActions(mockButton('EDIT') as ComponentData)).toEqual(['DELETE']);
  });

  test('returns default quick actions for normal buttons', () => {
    expect(getQuickActions(mockButton('BUTTON') as ComponentData)).toEqual(DEFAULT_QUICK_ACTIONS);
  });

  test('returns designated quick actions', () => {
    expect(getQuickActions({ cid: 'dt1', type: 'DataTable' } as ComponentData)).toEqual([
      'DELETE',
      'DUPLICATE',
      'CREATECOLUMN',
      'CREATEACTIONCOLUMN',
      'CHANGETYPE'
    ]);
    expect(getQuickActions({ cid: 'cp1', type: 'Composite' } as ComponentData)).toEqual([
      'DELETE',
      'DUPLICATE',
      'CREATE',
      'CREATEFROMDATA',
      'OPENCOMPONENT'
    ]);
  });

  test('returns correct actions for DataTableColumn', () => {
    expect(getQuickActions(mockColumn(false) as ComponentData)).toEqual(['DELETE', 'DUPLICATE']);
    expect(getQuickActions(mockColumn(true) as ComponentData)).toEqual(['DELETE', 'DUPLICATE', 'CREATEACTIONCOLUMNBUTTON']);
  });

  test('parentType overrides to DELETE', () => {
    expect(getQuickActions(mockButton('BUTTON') as ComponentData, 'DataTableColumn')).toEqual(['DELETE']);
  });

  test('parentType Dialog removes CREATEFROMDATA', () => {
    const result = getQuickActions(mockButton('BUTTON') as ComponentData, 'Dialog');
    expect(result).toEqual(['DELETE', 'DUPLICATE', 'CHANGETYPE', 'CREATE']);
    const resultComposite = getQuickActions({ cid: 'cp1', type: 'Composite' } as ComponentData, 'Dialog');
    expect(resultComposite).toEqual(['DELETE', 'DUPLICATE', 'CREATE', 'OPENCOMPONENT']);
  });
});

describe('helper', () => {
  test('detects dialog buttons', () => {
    expect(isDialogButton(mockButton('DIALOGCANCEL') as ComponentData)).toBe(true);
    expect(isDialogButton(mockButton('DIALOGSAVE') as ComponentData)).toBe(true);
    expect(isDialogButton(mockButton('EDIT') as ComponentData)).toBe(false);
  });

  test('detects editable buttons', () => {
    expect(isDataTableEditableButtons(mockButton('EDIT') as ComponentData)).toBe(true);
    expect(isDataTableEditableButtons(mockButton('DELETE') as ComponentData)).toBe(true);
    expect(isDataTableEditableButtons(mockButton('BUTTON') as ComponentData)).toBe(false);
  });
});

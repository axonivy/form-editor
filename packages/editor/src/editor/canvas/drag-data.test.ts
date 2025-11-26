import type { DeepPartial, FormData } from '@axonivy/form-editor-protocol';
import type { Active } from '@dnd-kit/core';
import { COLUMN_DROPZONE_ID_PREFIX, STRUCTURE_DROPZONE_ID_PREFIX, TABLE_DROPZONE_ID_PREFIX } from '../../data/data';
import { dragData, isDropZoneDisabled, type DragData } from './drag-data';

describe('dragData', () => {
  test('normal', () => {
    const data = filledData();
    expect(dragData(data.components[0]!)).toEqual<DragData>({ componentType: 'Input', disabledIds: [] });
  });

  test('layout', () => {
    const data = filledData();
    expect(dragData(data.components[2]!)).toEqual<DragData>({ componentType: 'Layout', disabledIds: ['31', '32', '33'] });
  });

  test('fieldset', () => {
    const data = filledData();
    expect(dragData(data.components[3]!)).toEqual<DragData>({ componentType: 'Fieldset', disabledIds: ['41', '42', '43'] });
  });

  test('panel', () => {
    const data = filledData();
    expect(dragData(data.components[4]!)).toEqual<DragData>({ componentType: 'Panel', disabledIds: ['51', '52', '53'] });
  });
});

describe('isDropZoneDisabled', () => {
  test('inactive draggable', () => {
    expect(isDropZoneDisabled('1', undefined, undefined, null)).toBeFalsy();
    expect(isDropZoneDisabled('1', undefined, undefined)).toBeFalsy();
  });

  test('drop zone from draggable', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled('1', undefined, undefined, active as Active)).toBeTruthy();
  });

  test('drop zone from pre element', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled('2', undefined, undefined, active as Active, '1')).toBeTruthy();
  });

  test('empty drop zone from structure element', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled(`${STRUCTURE_DROPZONE_ID_PREFIX}1`, undefined, undefined, active as Active)).toBeTruthy();
  });

  test('empty drop zone from table element', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled(`${TABLE_DROPZONE_ID_PREFIX}1`, undefined, undefined, active as Active)).toBeTruthy();
  });

  test('empty drop zone from table element', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled(`${COLUMN_DROPZONE_ID_PREFIX}1`, undefined, undefined, active as Active)).toBeTruthy();
  });

  test('disable all children for structure', () => {
    const active: Partial<Active> = { id: '0', data: { current: { componentType: 'Layout', disabledIds: ['2', '3'] } } };
    expect(isDropZoneDisabled('1', undefined, undefined, active as Active)).toBeFalsy();
    expect(isDropZoneDisabled('2', undefined, undefined, active as Active)).toBeTruthy();
    expect(isDropZoneDisabled('3', undefined, undefined, active as Active)).toBeTruthy();
  });

  test('disable columns', () => {
    let active: Partial<Active> = { id: '0', data: { current: undefined } };
    expect(isDropZoneDisabled('1', undefined, 'Input', active as Active)).toBeFalsy();
    expect(isDropZoneDisabled('2', undefined, 'DataTableColumn', active as Active)).toBeTruthy();

    active = { id: '0', data: { current: { componentType: 'Input', disabledIds: [] } } };
    expect(isDropZoneDisabled('1', undefined, 'Input', active as Active)).toBeFalsy();
    expect(isDropZoneDisabled('2', undefined, 'DataTableColumn', active as Active)).toBeTruthy();

    active = { id: '0', data: { current: { componentType: 'DataTableColumn', disabledIds: [] } } };
    expect(isDropZoneDisabled('1', undefined, 'Input', active as Active)).toBeTruthy();
    expect(isDropZoneDisabled('2', undefined, 'DataTableColumn', active as Active)).toBeFalsy();
  });
});

const filledData = () => {
  const prefilledData: DeepPartial<FormData> = {
    components: [
      { cid: '1', type: 'Input', config: {} },
      { cid: '2', type: 'Button', config: {} },
      {
        cid: '3',
        type: 'Layout',
        config: {
          components: [
            { cid: '31', type: 'Text', config: {} },
            { cid: '32', type: 'Button', config: {} },
            { cid: '33', type: 'Input', config: {} }
          ]
        }
      },
      {
        cid: '4',
        type: 'Fieldset',
        config: {
          label: 'Legend',
          collapsible: true,
          disabled: 'false',
          collapsed: false,
          components: [
            { cid: '41', type: 'Text', config: { content: 'Hello' } },
            { cid: '42', type: 'Button', config: {} },
            { cid: '43', type: 'Input', config: {} }
          ]
        }
      },
      {
        cid: '5',
        type: 'Panel',
        config: {
          label: 'Title',
          collapsible: true,
          collapsed: false,
          components: [
            { cid: '51', type: 'Text', config: { content: 'Hello' } },
            { cid: '52', type: 'Button', config: {} },
            { cid: '53', type: 'Input', config: {} }
          ]
        }
      }
    ]
  };
  return prefilledData as FormData;
};

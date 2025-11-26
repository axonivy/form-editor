import type { ComponentData, DataTable, DeepPartial } from '@axonivy/form-editor-protocol';
import { applyConfigOfPreviousComponent, componentForDataType } from './component-factory';

test('componentForDataType', () => {
  expect(componentForDataType('String')).toEqual({ type: 'Input' });
  expect(componentForDataType('Number')).toEqual({ type: 'Input', config: { type: 'NUMBER' } });
  expect(componentForDataType('Boolean')).toEqual({ type: 'Checkbox' });
  expect(componentForDataType('Date')).toEqual({ type: 'DatePicker' });
  expect(componentForDataType('DateTime')).toEqual({ type: 'DatePicker' });
  expect(componentForDataType('java.util.Date')).toEqual({ type: 'DatePicker' });
  expect(componentForDataType('List<String>')).toEqual({ type: 'DataTable' });
  expect(componentForDataType('Time')).toEqual({ type: undefined });
  expect(componentForDataType('File')).toEqual({ type: undefined });
});

describe('applyConfigOfPreviousComponent', () => {
  test('copy shared config keys from previous to current component', () => {
    const previous: DeepPartial<ComponentData> = {
      cid: 'prev1',
      type: 'Input',
      config: {
        label: 'Previous Label',
        value: 'Previous Value',
        disabled: ''
      }
    };

    const current: DeepPartial<ComponentData> = {
      cid: 'curr1',
      type: 'Textarea',
      config: {
        label: 'Current Label',
        value: 'Current Value',
        disabled: 'should change',
        rows: 'should stay'
      }
    };

    applyConfigOfPreviousComponent(previous as ComponentData, current as ComponentData);
    expect(current.config).toEqual({
      label: 'Previous Label',
      value: 'Previous Value',
      disabled: '',
      rows: 'should stay'
    });
  });

  test('handle table and radio/select component interactions', () => {
    const previous: DeepPartial<ComponentData> = {
      cid: 'prevTable',
      type: 'DataTable',
      config: {
        value: 'Table Value',
        components: []
      }
    };

    const current: DeepPartial<ComponentData> = {
      cid: 'currRadio',
      type: 'Radio',
      config: {
        dynamicItemsList: 'should change',
        value: 'should change'
      }
    };

    applyConfigOfPreviousComponent(previous as ComponentData, current as ComponentData);
    expect(current.config).toEqual({
      dynamicItemsList: 'Table Value',
      value: 'Table Value'
    });
  });

  test('handle radio/select and table component interactions', () => {
    const previous: DeepPartial<ComponentData> = {
      cid: 'prevRadio',
      type: 'Select',
      config: {
        dynamicItemsList: 'Radio Items',
        value: 'Cool Value'
      }
    };

    const current: DeepPartial<ComponentData> = {
      cid: 'currTable',
      type: 'DataTable',
      config: {
        value: 'should change',
        components: []
      }
    };

    applyConfigOfPreviousComponent(previous as ComponentData, current as ComponentData);
    expect((current.config as DataTable).value).toBe('Radio Items');
  });
});

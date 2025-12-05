import type { Component, DeepPartial, FormData } from '@axonivy/form-editor-protocol';
import { renderHook, waitFor } from '@testing-library/react';
import { customRenderHook } from 'test-utils';
import { useDataTableComponent } from '../../components/blocks/datatable/DataTable';
import type { ComponentConfig } from '../../types/config';
import { useComponentBlockActions } from './useComponentBlockActions';

const data = {
  id: 'a5c1d16e-1d08-4e1f-a9f0-436c553a3881',
  config: {
    renderer: 'JSF',
    theme: 'freya-ivy',
    type: 'FORM'
  },
  components: [
    {
      cid: 'datatable1',
      type: 'DataTable',
      config: {
        components: [],
        value: '#{data.persons}',
        isEditable: false,
        editDialogId: 'dialog3'
      }
    },
    {
      cid: 'dialog3',
      config: {
        components: [],
        header: 'Edit Row',
        id: '',
        lgSpan: '6',
        linkedComponent: 'datatable1',
        mdSpan: '12'
      },
      type: 'Dialog'
    }
  ]
} as DeepPartial<FormData> as FormData;

test('delete datatable also deletes dialog', async () => {
  const newData = [] as FormData[];
  const compData = { cid: 'datatable1', config: { editDialogId: 'dialog3' } } as Component;
  const { result: dataTableHook } = renderHook(() => useDataTableComponent());
  const { DataTableComponent } = dataTableHook.current;

  const view = customRenderHook(
    () =>
      useComponentBlockActions({
        config: DataTableComponent as unknown as ComponentConfig,
        data: compData,
        setComponentMenu: () => {},
        setPaletteMode: () => {}
      }),
    {
      wrapperProps: {
        appContext: { data: data, setData: data => newData.push(data), selectedElement: 'datatable1' }
      }
    }
  );
  await waitFor(() => expect(view.result.current).toBeDefined());
  expect(data.components.length).toBe(2);
  view.result.current.deleteElement();

  expect(newData[0]?.components.length).toBe(1);
  expect(newData[0]?.components[0]?.cid).toBe('dialog3');
  expect(newData[1]?.components.length).toBe(1);
  expect(newData[1]?.components[0]?.cid).toBe('datatable1');
});

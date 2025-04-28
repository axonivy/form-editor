import { customRenderHook } from 'test-utils';
import { useEditableDataTableField } from './useEditableDataTableField';
import type { ComponentData, FormData, TableConfig, VariableInfo } from '@axonivy/form-editor-protocol';
import { waitFor } from '@testing-library/react';
import type { DeepPartial } from '../../../../types/types';

const variable: DeepPartial<VariableInfo> = {
  variables: [
    {
      attribute: 'data',
      type: 'form.test.project.test.testData'
    }
  ],
  types: {
    'form.test.project.test.testData': [
      {
        attribute: 'persons',
        type: 'List<form.test.project.Person>'
      }
    ],
    'form.test.project.Person': [
      {
        attribute: 'firstname',
        type: 'String'
      },
      {
        attribute: 'id',
        type: 'Number'
      },
      {
        attribute: 'name',
        type: 'String'
      }
    ]
  }
};

const dialog: ComponentData = {
  cid: 'dialog3',
  config: {
    alignSelf: 'START',
    components: [],
    header: 'Edit Row',
    id: '',
    lgSpan: '6',
    linkedComponent: 'datatable1',
    mdSpan: '12',
    onApply: 'data.persons'
  },
  type: 'Dialog'
};
const editButton: ComponentData = {
  cid: 'button5',
  config: {
    action: '#{ivyFormDataTableHandler.editRow(row)}', // just placeholder, will be set from backend
    alignSelf: 'START',
    confirmCancelValue: 'components.button.confirm.no',
    confirmOkValue: 'components.button.confirm.yes',
    confirmHeader: 'components.button.confirm.confirmDialogHeader',
    confirmMessage: 'components.button.confirm.confirmDialogMessage',
    confirmSeverity: 'WARN',
    confirmDialog: false,
    disabled: '',
    icon: 'pi pi-pencil',
    id: '',
    lgSpan: '6',
    mdSpan: '12',
    name: '',
    processOnlySelf: false,
    type: 'EDIT',
    variant: 'PRIMARY',
    visible: ''
  },
  type: 'Button'
};

const deleteButton: ComponentData = {
  cid: 'button6',
  config: {
    action: '#{ivyFormDataTableHandler.deleteRow(row)}', // just placeholder, will be set from backend
    alignSelf: 'START',
    confirmCancelValue: 'components.button.confirm.no',
    confirmOkValue: 'components.button.confirm.yes',
    confirmHeader: 'components.button.confirm.confirmDialogHeader',
    confirmMessage: 'components.button.confirm.confirmDialogMessage',
    confirmSeverity: 'WARN',
    confirmDialog: true,
    disabled: '',
    icon: 'pi pi-trash',
    id: '',
    lgSpan: '6',
    mdSpan: '12',
    name: '',
    processOnlySelf: false,
    type: 'DELETE',
    variant: 'DANGER',
    visible: ''
  },
  type: 'Button'
};

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
        components: [
          {
            cid: 'datatablecolumn2',
            type: 'DataTableColumn',
            config: {
              header: 'name',
              value: 'name',
              components: [],
              asActionColumn: false,
              actionColumnAsMenu: false
            }
          }
        ],
        value: '#{data.persons}',
        isEditable: false,
        editDialogId: ''
      }
    }
  ]
} as FormData;

test('useEditableDataTableField createComponentData', async () => {
  const newData = [] as FormData[];
  const view = customRenderHook(() => useEditableDataTableField(), {
    wrapperProps: {
      appContext: { data, setData: data => newData.push(data), selectedElement: 'datatable1' },
      meta: { attributes: variable as VariableInfo }
    }
  });
  await waitFor(() => expect(view.result.current).toBeDefined());
  expect(data.components.length).toEqual(1);
  expect((data.components[0] as TableConfig).config.components.length).toEqual(1);
  view.result.current.createEditComponents();

  expect(newData[0].components.length).toEqual(2);
  expect(newData[0].components[0].cid).toEqual('datatable1');
  expect((newData[0].components[0] as TableConfig).config.components.length).toEqual(2);
  expect((newData[0].components[0] as TableConfig).config.components[0].config.components.length).toEqual(0);
  expect((newData[0].components[0] as TableConfig).config.components[1].config.components.length).toEqual(2);

  expect((newData[0].components[0] as TableConfig).config.components[1].config.components[0]).toEqual(editButton);
  expect((newData[0].components[0] as TableConfig).config.components[1].config.components[1]).toEqual(deleteButton);

  expect(newData[0].components[1]).toEqual(dialog);
  expect((newData[1].components[0] as TableConfig).config.editDialogId).toEqual('dialog3');
});

const dataEditableTable = {
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
        components: [
          {
            cid: 'datatablecolumn2',
            type: 'DataTableColumn',
            config: {
              header: 'name',
              value: 'name',
              components: [],
              asActionColumn: false,
              actionColumnAsMenu: false
            }
          },
          {
            cid: 'datatablecolumn3',
            type: 'DataTableColumn',
            config: {
              header: 'name',
              value: 'name',
              components: [editButton, deleteButton],
              asActionColumn: true,
              actionColumnAsMenu: false
            }
          }
        ],
        value: '#{data.persons}',
        isEditable: false,
        editDialogId: 'dialog3'
      }
    },
    dialog
  ]
} as FormData;

test('useEditableDataTableField deleteComponentData', async () => {
  const newData = [] as FormData[];
  const view = customRenderHook(() => useEditableDataTableField(), {
    wrapperProps: {
      appContext: { data: dataEditableTable, setData: data => newData.push(data), selectedElement: 'datatable1' },
      meta: { attributes: variable as VariableInfo }
    }
  });
  await waitFor(() => expect(view.result.current).toBeDefined());
  expect(dataEditableTable.components.length).toEqual(2);
  expect((dataEditableTable.components[0] as TableConfig).config.components[1].config.components.length).toEqual(2);
  view.result.current.deleteEditComponents();
  expect(newData[0].components.length).toEqual(1);
  expect(newData[0].components[0].cid).toEqual('datatable1');
  expect((newData[0].components[0] as TableConfig).config.components.length).toEqual(2);
  expect((newData[0].components[0] as TableConfig).config.components[0].config.components.length).toEqual(0);
  expect((newData[0].components[0] as TableConfig).config.components[1].config.components.length).toEqual(0);
  expect((newData[1].components[0] as TableConfig).config.editDialogId).toEqual('');
});

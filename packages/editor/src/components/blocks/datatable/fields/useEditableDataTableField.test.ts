import type { Button, ComponentDataHelper, DeepPartial, Dialog, FormData, TableConfig, VariableInfo } from '@axonivy/form-editor-protocol';
import { waitFor } from '@testing-library/react';
import { customRenderHook } from 'test-utils';
import { useEditableDataTableField } from './useEditableDataTableField';

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

const dialog: ComponentDataHelper<'Dialog', Dialog> = {
  cid: 'dialog3',
  config: {
    alignSelf: 'START',
    buttons: [
      {
        cid: 'button3',
        type: 'Button',
        config: {
          action: 'cancelEdit',
          alignSelf: 'START',
          confirmCancelValue: '',
          confirmDialog: false,
          confirmHeader: '',
          confirmMessage: '',
          confirmOkValue: '',
          confirmSeverity: 'WARN',
          disabled: '',
          icon: '',
          id: '',
          lgSpan: '6',
          mdSpan: '12',
          name: 'Cancel',
          processOnlySelf: false,
          rounded: false,
          style: 'FLAT',
          type: 'DIALOGCANCEL',
          variant: 'SECONDARY',
          visible: ''
        }
      },
      {
        cid: 'button4',
        type: 'Button',
        config: {
          action: 'saveEdit',
          alignSelf: 'START',
          confirmCancelValue: '',
          confirmDialog: false,
          confirmHeader: '',
          confirmMessage: '',
          confirmOkValue: '',
          confirmSeverity: 'WARN',
          disabled: '',
          icon: 'si si-check-1',
          id: '',
          lgSpan: '6',
          mdSpan: '12',
          name: 'Save',
          processOnlySelf: false,
          rounded: false,
          style: 'SOLID',
          type: 'DIALOGSAVE',
          variant: 'PRIMARY',
          visible: ''
        }
      }
    ],
    components: [],
    header: 'Edit Row',
    id: '',
    lgSpan: '6',
    linkedComponent: 'datatable1',
    mdSpan: '12'
  },
  type: 'Dialog'
};
const editButton: ComponentDataHelper<'Button', Button> = {
  cid: 'button6',
  config: {
    action: 'editRow', // just placeholder, will be set from backend
    alignSelf: 'START',
    confirmCancelValue: '',
    confirmOkValue: '',
    confirmHeader: '',
    confirmMessage: '',
    confirmSeverity: 'WARN',
    confirmDialog: false,
    disabled: '',
    icon: 'pi pi-pencil',
    id: '',
    lgSpan: '6',
    mdSpan: '12',
    name: '',
    processOnlySelf: false,
    rounded: false,
    style: 'SOLID',
    type: 'EDIT',
    variant: 'PRIMARY',
    visible: ''
  },
  type: 'Button'
};

const deleteButton: ComponentDataHelper<'Button', Button> = {
  cid: 'button7',
  config: {
    action: 'deleteRow', // just placeholder, will be set from backend
    alignSelf: 'START',
    confirmCancelValue: 'No',
    confirmOkValue: 'Yes',
    confirmHeader: 'Delete Confirmation',
    confirmMessage: 'Are you sure you want to delete row: #{currentRow}?',
    confirmSeverity: 'WARN',
    confirmDialog: true,
    disabled: '',
    icon: 'pi pi-trash',
    id: '',
    lgSpan: '6',
    mdSpan: '12',
    name: '',
    processOnlySelf: false,
    rounded: false,
    style: 'SOLID',
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
} as DeepPartial<FormData> as FormData;

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

  expect(newData[0]?.components.length).toEqual(2);
  expect(newData[0]?.components[0]?.cid).toEqual('datatable1');
  expect((newData[0]?.components[0] as TableConfig).config.components.length).toEqual(2);
  expect((newData[0]?.components[0] as TableConfig).config.components[0]?.config.components.length).toEqual(0);
  expect((newData[0]?.components[0] as TableConfig).config.components[1]?.config.components.length).toEqual(2);

  expect((newData[0]?.components[0] as TableConfig).config.components[1]?.config.components[0]).toEqual(editButton);
  expect((newData[0]?.components[0] as TableConfig).config.components[1]?.config.components[1]).toEqual(deleteButton);

  expect(newData[0]?.components[1]).toEqual(dialog);
  expect((newData[1]?.components[0] as TableConfig).config.editDialogId).toEqual('dialog3');
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
  expect((dataEditableTable.components[0] as TableConfig).config.components[1]?.config.components.length).toEqual(2);
  view.result.current.deleteEditComponents();
  expect(newData[0]?.components.length).toEqual(1);
  expect(newData[0]?.components[0]?.cid).toEqual('datatable1');
  expect((newData[0]?.components[0] as TableConfig).config.components.length).toEqual(2);
  expect((newData[0]?.components[0] as TableConfig).config.components[0]?.config.components.length).toEqual(0);
  expect((newData[0]?.components[0] as TableConfig).config.components[1]?.config.components.length).toEqual(0);
  expect((newData[1]?.components[0] as TableConfig).config.editDialogId).toEqual('');
});

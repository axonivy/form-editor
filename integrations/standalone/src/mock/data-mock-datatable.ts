import type { DeepPartial, FormData } from '@axonivy/form-editor-protocol';

export const dataDataTable: DeepPartial<FormData> = {
  id: 'a5c1d16e-1d08-4e1f-a9f0-436c553a3881',
  config: {
    renderer: 'JSF',
    theme: '',
    type: 'FORM'
  },
  components: [
    {
      cid: 'DataTable-a1ff78f7-0cb5-4a5f-902d-7b95b4e65a69',
      type: 'DataTable',
      config: {
        lgSpan: '6',
        mdSpan: '12',
        components: [],
        label: 'Label',
        value: '#{data.data.persons}'
      }
    }
  ]
};

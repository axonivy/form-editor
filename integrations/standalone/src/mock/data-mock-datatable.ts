import type { DeepPartial, FormData } from '@axonivy/form-editor-protocol';

export const dataDataTable: DeepPartial<FormData> = {
  config: {
    title: 'Mock Form with DataTable',
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

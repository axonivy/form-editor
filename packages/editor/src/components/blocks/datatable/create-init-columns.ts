import type { FormData } from '@axonivy/form-editor-protocol';
import { modifyData, TABLE_DROPZONE_ID_PREFIX } from '../../../data/data';
import type { CreateData } from '../../component-factory';

export const createInitTableColumns = (id: string, data: FormData, creates: Array<CreateData<'DataTableColumn'>>) => {
  creates.forEach(create => {
    data = modifyData(data, {
      type: 'add',
      data: { componentType: 'DataTableColumn', targetId: TABLE_DROPZONE_ID_PREFIX + id, create }
    }).newData;
  });
  return data;
};

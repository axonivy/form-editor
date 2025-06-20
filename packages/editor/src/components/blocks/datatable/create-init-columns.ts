import type { FormData } from '@axonivy/form-editor-protocol';
import { modifyData, TABLE_DROPZONE_ID_PREFIX } from '../../../data/data';
import type { ComponentByName } from '../../components';
import type { CreateData } from '../../component-factory';

export const createInitTableColumns = (
  id: string,
  data: FormData,
  creates: Array<CreateData<'DataTableColumn'>>,
  componentByName: ComponentByName
) => {
  creates.forEach(create => {
    data = modifyData(data, {
      type: 'add',
      data: { componentName: 'DataTableColumn', targetId: TABLE_DROPZONE_ID_PREFIX + id, create, componentByName }
    }).newData;
  });
  return data;
};

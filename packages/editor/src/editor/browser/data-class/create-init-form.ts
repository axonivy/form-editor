import type { ComponentType, FormData } from '@axonivy/form-editor-protocol';
import type { CreateData } from '../../../components/component-factory';
import { modifyData, STRUCTURE_DROPZONE_ID_PREFIX } from '../../../data/data';

export const createInitForm = (
  data: FormData,
  creates: Array<{ type: ComponentType; config: CreateData }>,
  workflowButtons: boolean,
  selectedElementId?: string
) => {
  creates.forEach(create => {
    data = modifyData(data, {
      type: 'add',
      data: { componentType: create.type, create, targetId: selectedElementId }
    }).newData;
  });
  if (workflowButtons) {
    const { newData, newComponentId } = modifyData(data, {
      type: 'add',
      data: {
        componentType: 'Layout',
        create: { label: '', value: '', config: { type: 'FLEX', justifyContent: 'END' } },
        targetId: selectedElementId
      }
    });
    const layoutId = `${STRUCTURE_DROPZONE_ID_PREFIX}${newComponentId}`;
    data = modifyData(newData, {
      type: 'add',
      data: {
        componentType: 'Button',
        create: {
          label: 'Cancel',
          value: '#{ivyWorkflowView.cancel()}',
          config: { variant: 'SECONDARY', processOnlySelf: true, style: 'FLAT' }
        },
        targetId: layoutId
      }
    }).newData;
    data = modifyData(data, {
      type: 'add',
      data: {
        componentType: 'Button',
        create: {
          label: 'Proceed',
          value: '#{logic.close}',
          config: { variant: 'PRIMARY', type: 'SUBMIT', icon: 'si si-check-1' }
        },
        targetId: layoutId
      }
    }).newData;
  }
  return data;
};

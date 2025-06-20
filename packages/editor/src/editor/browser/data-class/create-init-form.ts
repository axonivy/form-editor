import type { CreateData } from '../../../components/component-factory';
import type { ComponentByName } from '../../../components/components';
import { modifyData, STRUCTURE_DROPZONE_ID_PREFIX } from '../../../data/data';
import type { ComponentType, FormData } from '@axonivy/form-editor-protocol';

export const createInitForm = (
  data: FormData,
  creates: Array<{ type: ComponentType; config: CreateData }>,
  workflowButtons: boolean,
  componentByName: ComponentByName,
  selectedElementId?: string
) => {
  creates.forEach(create => {
    data = modifyData(data, {
      type: 'add',
      data: { componentName: create.type, create, targetId: selectedElementId, componentByName }
    }).newData;
  });
  if (workflowButtons) {
    const { newData, newComponentId } = modifyData(data, {
      type: 'add',
      data: {
        componentName: 'Layout',
        create: { label: '', value: '', config: { type: 'FLEX', justifyContent: 'END' } },
        targetId: selectedElementId,
        componentByName
      }
    });
    const layoutId = `${STRUCTURE_DROPZONE_ID_PREFIX}${newComponentId}`;
    data = modifyData(newData, {
      type: 'add',
      data: {
        componentName: 'Button',
        create: {
          label: 'Cancel',
          value: '#{ivyWorkflowView.cancel()}',
          config: { variant: 'SECONDARY', processOnlySelf: true, style: 'FLAT' }
        },
        targetId: layoutId,
        componentByName
      }
    }).newData;
    data = modifyData(data, {
      type: 'add',
      data: {
        componentName: 'Button',
        create: {
          label: 'Proceed',
          value: '#{logic.close}',
          config: { variant: 'PRIMARY', type: 'SUBMIT', icon: 'si si-check-1' }
        },
        targetId: layoutId,
        componentByName
      }
    }).newData;
  }
  return data;
};

import {
  isButton,
  isColumn,
  isComponentType,
  isStructure,
  isTable,
  type ComponentData,
  type ComponentType,
  type ConfigData,
  type FormData,
  type TableConfig
} from '@axonivy/form-editor-protocol';
import { createComponent, type CreateData } from '../components/component-factory';
import { useAppContext } from '../context/AppContext';
import type { UpdateConsumer } from '../types/types';
import { add, remove } from '../utils/array';

export const CANVAS_DROPZONE_ID = 'canvas';
export const DELETE_DROPZONE_ID = 'delete';
export const STRUCTURE_DROPZONE_ID_PREFIX = 'layout-';
export const TABLE_DROPZONE_ID_PREFIX = 'table-';
export const COLUMN_DROPZONE_ID_PREFIX = 'column-';
export const DIALOG_DROPZONE_ID_PREFIX = 'dialog-';

const findComponent = (
  data: Array<ComponentData>,
  id: string,
  parent?: ComponentData
): { data: Array<ComponentData>; index: number; parent?: ComponentData } | undefined => {
  if (id === CANVAS_DROPZONE_ID) {
    return { data, index: data.length };
  }
  if (id.startsWith(STRUCTURE_DROPZONE_ID_PREFIX)) {
    return findStructureComponent(data, id.replace(STRUCTURE_DROPZONE_ID_PREFIX, ''));
  }
  if (id.startsWith(TABLE_DROPZONE_ID_PREFIX)) {
    return findTableComponent(data, id.replace(TABLE_DROPZONE_ID_PREFIX, ''));
  }
  if (id.startsWith(COLUMN_DROPZONE_ID_PREFIX)) {
    return findDataTableColumnComponent(data, id.replace(COLUMN_DROPZONE_ID_PREFIX, ''));
  }
  return findComponentDeep(data, id, parent);
};

export const findComponentDeep = (data: Array<ComponentData>, id: string, parent?: ComponentData) => {
  const index = data.findIndex(obj => obj.cid === id);
  if (index < 0) {
    for (const element of data) {
      if (isTable(element) || isStructure(element) || isColumn(element)) {
        const find = findComponent(element.config.components, id, element);
        if (find) {
          return find;
        }
      }
    }
    return;
  }
  return { data, index, parent };
};

const findStructureComponent = (data: Array<ComponentData>, id: string) => {
  const find = findComponentDeep(data, id);
  if (find) {
    const structure = find.data[find.index];
    if (isStructure(structure)) {
      const structureData = structure.config.components;
      return { data: structureData, index: structureData.length };
    }
  }
  return;
};

export const findTableComponent = (data: Array<ComponentData>, id: string) => {
  const find = findComponentDeep(data, id);
  if (find) {
    const table = find.data[find.index];
    if (isTable(table)) {
      const tableData = table.config.components;
      return { data: tableData, index: tableData.length };
    }
  }
  return;
};

const findDataTableColumnComponent = (data: Array<ComponentData>, id: string) => {
  const parentTableComponent = getParentComponent(data, id);
  if (isTable(parentTableComponent)) {
    const column = parentTableComponent.config.components.find(col => col.cid === id);
    if (column) {
      const columnData = column.config.components;
      return { data: columnData, index: columnData.length };
    }
  }

  return undefined;
};

export const getParentComponent = (data: Array<ComponentData>, elementCid: string) => {
  const find = findComponentDeep(data, elementCid);
  return find?.parent;
};

const getParentTable = (data: Array<ComponentData>, element: ComponentData | undefined): ComponentData | undefined => {
  if (isTable(element)) {
    return element;
  }
  if (isColumn(element) || isButton(element)) {
    return getParentTable(data, getParentComponent(data, element.cid));
  }
  return undefined;
};

export const isEditableTable = (data: Array<ComponentData>, element: ComponentData | undefined): boolean => {
  const parentTable = getParentTable(data, element);
  return parentTable ? (parentTable as TableConfig).config.isEditable : false;
};

const addComponent = (data: Array<ComponentData>, component: ComponentData, id: string) => {
  const find = findComponent(data, id);
  if (find) {
    if (!id.startsWith(TABLE_DROPZONE_ID_PREFIX) && !isTable(find.parent) && component.type === 'DataTableColumn') {
      console.warn('It is not possible to add a data table column to a non-table');
      return;
    }
    if (isTable(find.parent) && component.type !== 'DataTableColumn') {
      console.warn('It is not possible to add something else than columns to a data table');
      return;
    }
    if (isColumn(find.parent) && component.type !== 'Button') {
      console.warn('It is not possible to add something else than buttons to a action column');
      return;
    }
    add(find.data, component, find.index);
    return component.cid;
  }
  data.push(component);
  return component.cid;
};

const removeComponent = (data: Array<ComponentData>, id: string) => {
  const find = findComponent(data, id);
  if (find) {
    return remove(find.data, find.index);
  }
  return;
};

const moveComponent = (data: Array<ComponentData>, id: string, indexMove: number) => {
  const find = findComponent(data, id);
  if (find) {
    const removed = remove(find.data, find.index);
    if (removed === undefined) {
      return;
    }
    const moveIndex = find.index + indexMove < 0 ? 0 : find.index + indexMove;
    add(find.data, removed, moveIndex);
  }
  return;
};

type ModifyAction<TType extends ComponentType = ComponentType> =
  | {
      type: 'dnd';
      data: {
        activeId: string;
        targetId: string;
        create?: CreateData;
      };
    }
  | { type: 'add'; data: { componentType: TType; create?: CreateData<TType>; targetId?: string } }
  | { type: 'remove' | 'moveUp' | 'moveDown'; data: { id: string } }
  | {
      type: 'paste';
      data: {
        componentType: TType;
        clipboard: Partial<ConfigData>;
        targetId: string;
      };
    };

const dndModify = (data: Array<ComponentData>, action: Extract<ModifyAction, { type: 'dnd' }>['data']) => {
  if (isComponentType(action.activeId)) {
    return addComponent(data, createComponentData(data, action.activeId, action.create), action.targetId);
  } else {
    const removed = removeComponent(data, action.activeId);
    if (removed && action.targetId !== DELETE_DROPZONE_ID) {
      return addComponent(data, removed, action.targetId);
    }
    return undefined;
  }
};

const createComponentData = (data: Array<ComponentData>, type: ComponentType, createData?: CreateData): ComponentData => ({
  cid: createId(data, type),
  type,
  config: createComponent(type, createData)
});

const createId = (components: Array<ComponentData>, type: ComponentType) => {
  const ids = allCids(components);
  const nextId = `${type}${highestIdNumber(ids) + 1}`.toLowerCase();
  if (ids.has(nextId)) {
    return createId(components, type);
  }
  return nextId;
};

const highestIdNumber = (ids: Set<string>): number => {
  const numbers = Array.from(ids)
    .map(id => {
      const match = id.match(/\d+$/);
      return match ? parseInt(match[0]) : -1;
    })
    .filter(num => num !== -1);
  return numbers.length > 0 ? Math.max(...numbers) : 0;
};

const allCids = (components: Array<ComponentData>) => {
  const ids = new Set<string>();
  for (const component of components) {
    ids.add(component.cid);
    if ('components' in component.config) {
      allCids(component.config.components as Array<ComponentData>).forEach(id => ids.add(id));
    }
  }
  return ids;
};

const pasteComponent = (data: FormData, type: ComponentType, clipboard: Partial<ComponentData['config']>, targetId: string) => {
  const newComponent = createComponentData(data.components, type, { config: clipboard });
  newComponent.cid = 'copy';
  if (newComponent) {
    const added = addComponent(data.components, newComponent, targetId);
    defineNewCid(data.components, newComponent);
    return added;
  }
  return undefined;
};

const defineNewCid = (components: Array<ComponentData>, component: ComponentData) => {
  component.cid = createId(components, component.type);
  if (isStructure(component) || isTable(component) || isColumn(component)) {
    for (const child of component.config.components) {
      defineNewCid(components, child);
    }
  }
};

export const modifyData = <TType extends ComponentType>(data: FormData, action: ModifyAction<TType>) => {
  const newData = structuredClone(data);
  let newComponentId;
  switch (action.type) {
    case 'dnd':
      newComponentId = dndModify(newData.components, action.data);
      break;
    case 'add':
      newComponentId = addComponent(
        newData.components,
        createComponentData(newData.components, action.data.componentType, action.data.create),
        action.data.targetId ?? CANVAS_DROPZONE_ID
      );
      break;
    case 'paste':
      pasteComponent(newData, action.data.componentType, action.data.clipboard, action.data.targetId);
      break;
    case 'remove':
      removeComponent(newData.components, action.data.id);
      break;
    case 'moveUp':
      moveComponent(newData.components, action.data.id, -1);
      break;
    case 'moveDown':
      moveComponent(newData.components, action.data.id, 1);
      break;
  }
  return { newData, newComponentId };
};

export const findComponentElement = (data: FormData, id: string) => {
  const find = findComponent(data.components, id);
  if (find) {
    return { element: find.data[find.index], parent: find.parent };
  }
  return;
};

export const creationTargetId = (data: Array<ComponentData>, elementId?: string) => {
  if (elementId === undefined) {
    return elementId;
  }
  const structure = findStructureComponent(data, elementId);
  if (structure) {
    return STRUCTURE_DROPZONE_ID_PREFIX + elementId;
  }
  return elementId;
};

export const useData = () => {
  const { data, setData, selectedElement, setSelectedElement, history } = useAppContext();
  const foundElement = selectedElement !== undefined ? findComponentElement(data, selectedElement) : undefined;
  const setHistoricisedData: UpdateConsumer<FormData> = updateData => {
    setData(old => {
      const newData = updateData(old);
      history.push(newData);
      return newData;
    });
  };
  const setElement: UpdateConsumer<ComponentData> = updateElement => {
    setHistoricisedData(oldData => {
      if (foundElement?.element === undefined) {
        return oldData;
      }
      const findElement = findComponentElement(oldData, foundElement.element.cid);
      if (findElement?.element) {
        updateElement(findElement.element);
      }
      return oldData;
    });
  };
  return {
    data,
    setData: setHistoricisedData,
    setUnhistoricisedData: setData,
    element: foundElement?.element,
    setElement,
    setSelectedElement,
    parent: foundElement?.parent
  };
};

import { useAppContext } from '../../context/AppContext';
import type { Button, ComponentType, Composite } from '@axonivy/form-editor-protocol';
import { COLUMN_DROPZONE_ID_PREFIX, creationTargetId, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../data/data';
import type { DraggableProps } from './ComponentBlock';
import { useReadonly } from '@axonivy/ui-components';
import { useAction } from '../../context/useAction';
import type { Dispatch, SetStateAction } from 'react';
import { addDefaults } from '../../components/component-factory';

export const useComponentBlockActions = ({
  config,
  data,
  setShowExtractDialog
}: DraggableProps & { setShowExtractDialog: Dispatch<SetStateAction<boolean>> }) => {
  const { setSelectedElement, setUi } = useAppContext();
  const readonly = useReadonly();
  const { setData } = useData();
  const isDataTableEditableButtons =
    data.type === 'Button' && ((data.config as Button).type === 'EDIT' || (data.config as Button).type === 'DELETE');
  const elementConfig = addDefaults(data.type, data.config);
  const deleteElement = () => {
    setData(oldData => modifyData(oldData, { type: 'remove', data: { id: data.cid } }).newData);
    config.onDelete?.({ ...elementConfig }, setData);
    setSelectedElement(undefined);
  };

  const openComponent = useAction('openComponent');
  const duplicateElement = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'paste',
          data: { componentType: data.type, clipboard: data.config, targetId: data.cid }
        }).newData
    );
  };

  const createColumn = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: {
            componentType: 'DataTableColumn',
            targetId: TABLE_DROPZONE_ID_PREFIX + data.cid
          }
        }).newData
    );
  };

  const createActionColumn = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: {
            componentType: 'DataTableColumn',
            targetId: TABLE_DROPZONE_ID_PREFIX + data.cid,
            create: {
              label: 'Actions',
              value: '',
              config: {
                asActionColumn: true
              }
            }
          }
        }).newData
    );
  };

  const createActionButton = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: { componentType: 'Button', targetId: COLUMN_DROPZONE_ID_PREFIX + data.cid }
        }).newData
    );
  };

  const createElement = (name: ComponentType) => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: { componentType: name, targetId: creationTargetId(oldData.components, data.cid) }
        }).newData
    );
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      setSelectedElement(data.cid);
      setUi(old => ({ ...old, properties: true }));
    }
    if (readonly) return;
    if (e.key === 'Delete') {
      e.stopPropagation();
      deleteElement();
    }
    if (e.key === 'ArrowUp' && !isDataTableEditableButtons) {
      e.stopPropagation();
      setData(oldData => modifyData(oldData, { type: 'moveUp', data: { id: data.cid } }).newData);
    }
    if (e.key === 'ArrowDown' && !isDataTableEditableButtons) {
      e.stopPropagation();
      setData(oldData => modifyData(oldData, { type: 'moveDown', data: { id: data.cid } }).newData);
    }
    if (e.code === 'KeyM' && !isDataTableEditableButtons) {
      e.stopPropagation();
      duplicateElement();
    }
    if (e.code === 'KeyJ' && config.quickActions.find(q => q === 'OPENCOMPONENT')) {
      e.stopPropagation();
      openComponent((data.config as Composite).name);
    }
    if (e.code === 'KeyE' && config.quickActions.find(q => q === 'EXTRACTINTOCOMPONENT')) {
      e.stopPropagation();
      setTimeout(() => setShowExtractDialog(true), 0);
    }
  };
  return {
    deleteElement,
    duplicateElement,
    openComponent,
    onKeyDown,
    createColumn,
    createActionColumn,
    createActionButton,
    createElement
  };
};

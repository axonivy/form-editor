import { useAppContext } from '../../context/AppContext';
import type { Button, ComponentType, Composite } from '@axonivy/form-editor-protocol';
import { COLUMN_DROPZONE_ID_PREFIX, creationTargetId, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../data/data';
import type { DraggableProps } from './ComponentBlock';
import { useReadonly } from '@axonivy/ui-components';
import { useAction } from '../../context/useAction';
import { useComponents } from '../../context/ComponentsContext';

export const useComponentBlockActions = ({
  config,
  data,
  setShowExtractDialog
}: DraggableProps & { setShowExtractDialog: (open: boolean) => void }) => {
  const { setSelectedElement, setUi } = useAppContext();
  const { componentByName } = useComponents();
  const readonly = useReadonly();
  const { setData } = useData();
  const isDataTableEditableButtons =
    data.type === 'Button' && ((data.config as Button).type === 'EDIT' || (data.config as Button).type === 'DELETE');

  const elementConfig = { ...config.defaultProps, ...data.config };
  const deleteElement = () => {
    setData(oldData => modifyData(oldData, { type: 'remove', data: { id: data.cid } }, componentByName).newData);
    config.onDelete?.(elementConfig, setData);
    setSelectedElement(undefined);
  };

  const openComponent = useAction('openComponent');
  const duplicateElement = () => {
    setData(oldData => modifyData(oldData, { type: 'paste', data: { id: data.cid } }, componentByName).newData);
  };

  const createColumn = () => {
    setData(
      oldData =>
        modifyData(
          oldData,
          {
            type: 'add',
            data: {
              componentName: 'DataTableColumn',
              targetId: TABLE_DROPZONE_ID_PREFIX + data.cid
            }
          },
          componentByName
        ).newData
    );
  };

  const createActionColumn = () => {
    setData(
      oldData =>
        modifyData(
          oldData,
          {
            type: 'add',
            data: {
              componentName: 'DataTableColumn',
              targetId: TABLE_DROPZONE_ID_PREFIX + data.cid,
              create: {
                label: 'Actions',
                value: '',
                defaultProps: {
                  asActionColumn: true
                }
              }
            }
          },
          componentByName
        ).newData
    );
  };

  const createActionButton = () => {
    setData(
      oldData =>
        modifyData(
          oldData,
          {
            type: 'add',
            data: { componentName: 'Button', targetId: COLUMN_DROPZONE_ID_PREFIX + data.cid }
          },
          componentByName
        ).newData
    );
  };

  const createElement = (name: ComponentType) => {
    setData(
      oldData =>
        modifyData(
          oldData,
          { type: 'add', data: { componentName: name, targetId: creationTargetId(oldData.components, data.cid) } },
          componentByName
        ).newData
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
      setData(oldData => modifyData(oldData, { type: 'moveUp', data: { id: data.cid } }, componentByName).newData);
    }
    if (e.key === 'ArrowDown' && !isDataTableEditableButtons) {
      e.stopPropagation();
      setData(oldData => modifyData(oldData, { type: 'moveDown', data: { id: data.cid } }, componentByName).newData);
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

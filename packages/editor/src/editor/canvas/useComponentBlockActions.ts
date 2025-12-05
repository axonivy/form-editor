import type { ComponentType } from '@axonivy/form-editor-protocol';
import { useDialogHotkeys } from '@axonivy/ui-components';
import type { Dispatch, SetStateAction } from 'react';
import { addDefaults } from '../../components/component-factory';
import { useAppContext } from '../../context/AppContext';
import { useAction } from '../../context/useAction';
import { COLUMN_DROPZONE_ID_PREFIX, creationTargetId, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../data/data';
import type { DraggableProps } from './ComponentBlock';
import type { PaletteMode } from './quickbar/Quickbar';

export const useComponentBlockActions = ({
  config,
  data,
  setComponentMenu,
  setPaletteMode
}: DraggableProps & {
  setComponentMenu: Dispatch<SetStateAction<boolean>>;
  setPaletteMode: Dispatch<SetStateAction<PaletteMode>>;
}) => {
  const { setSelectedElement } = useAppContext();
  const { setData } = useData();
  const { open: showExtractDialog, onOpenChange: onOpenExtractDialogChange } = useDialogHotkeys(['extractDialog']);
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

  const changeElementType = (name: ComponentType) => {
    let newCid;
    setData(oldData => {
      const result = modifyData(oldData, {
        type: 'changeType',
        data: { id: data.cid, componentType: name }
      });
      newCid = result.newComponentId ?? data.cid;
      setSelectedElement(newCid);
      return result.newData;
    });
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

  const toggleComponentMenu = (paletteMode: PaletteMode) => {
    setPaletteMode(paletteMode);
    setComponentMenu(old => !old);
  };

  const extractComponent = {
    data,
    openDialog: showExtractDialog,
    setOpenDialog: onOpenExtractDialogChange
  };

  return {
    deleteElement,
    duplicateElement,
    openComponent,
    createColumn,
    toggleComponentMenu,
    createActionColumn,
    createActionButton,
    changeElementType,
    createElement,
    extractComponent
  };
};

import type { Button as ButtonType, Component, ComponentData, Composite, DataTableColumn } from '@axonivy/form-editor-protocol';
import { cn, evalDotState, Popover, PopoverAnchor, useDialogHotkeys, useReadonly } from '@axonivy/ui-components';
import { useDraggable } from '@dnd-kit/core';
import { addDefaults } from '../../components/component-factory';
import { useAppContext } from '../../context/AppContext';
import { useComponents } from '../../context/ComponentsContext';
import { useValidations } from '../../context/useValidation';
import { getParentComponent, useData } from '../../data/data';
import type { ComponentConfig } from '../../types/config';
import './ComponentBlock.css';
import { dragData } from './drag-data';
import { DropZone, type DropZoneProps } from './DropZone';
import { Quickbar } from './Quickbar';
import { useComponentBlockActions } from './useComponentBlockActions';
import { useCopyPaste } from './useCopyPaste';

type ComponentBlockProps = Omit<DropZoneProps, 'id'> & {
  component: ComponentData | Component;
  preId?: string;
};

export const ComponentBlock = ({ component, preId, ...props }: ComponentBlockProps) => {
  const { componentByName } = useComponents();
  const config = componentByName(component.type);
  if (!config) {
    return null;
  }
  return (
    <DropZone id={component.cid} type={component.type} preId={preId} {...props}>
      <Draggable config={config} data={component} />
    </DropZone>
  );
};

export type DraggableProps = {
  config: ComponentConfig;
  data: Component | ComponentData;
};

const Draggable = ({ config, data }: DraggableProps) => {
  const { setUi } = useAppContext();
  const { data: formData } = useData();
  const readonly = useReadonly();
  const isDataTableEditableButtons =
    data.type === 'Button' && ((data.config as ButtonType).type === 'EDIT' || (data.config as ButtonType).type === 'DELETE');
  const isDialogButton =
    data.type === 'Button' && ((data.config as ButtonType).type === 'DIALOGCANCEL' || (data.config as ButtonType).type === 'DIALOGSAVE');

  const { isDragging, attributes, listeners, setNodeRef } = useDraggable({
    disabled: readonly || isDataTableEditableButtons || isDialogButton,
    id: data.cid,
    data: dragData(data)
  });
  const { selectedElement, setSelectedElement } = useAppContext();
  const isSelected = selectedElement === data.cid;
  const elementConfig = addDefaults(data.type, data.config);
  const { open: showExtractDialog, onOpenChange: onOpenExtractDialogChange } = useDialogHotkeys(['extractDialog']);
  const {
    createElement,
    duplicateElement,
    openComponent,
    onKeyDown,
    deleteElement,
    createActionButton,
    changeElementType,
    createActionColumn,
    createColumn
  } = useComponentBlockActions({ config, data, setShowExtractDialog: onOpenExtractDialogChange });
  const validations = useValidations(data.cid);
  const clipboardProps = useCopyPaste(data);
  const parentComponent = getParentComponent(formData.components, data.cid);
  if (data.type === 'Dialog') {
    return null;
  }
  return (
    <Popover open={isSelected && !isDragging}>
      <PopoverAnchor asChild>
        <div
          onClick={e => {
            e.stopPropagation();
            setSelectedElement(data.cid);
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            setUi(old => ({ ...old, properties: true }));
          }}
          onKeyDown={onKeyDown}
          className={cn(
            'draggable',
            isSelected && 'selected',
            isDragging && 'dragging',
            validations.length > 0 && `validation ${evalDotState(validations, undefined)}`
          )}
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          {...clipboardProps}
        >
          {config.render({ ...elementConfig, id: data.cid })}
        </div>
      </PopoverAnchor>
      {!isDialogButton && (
        <Quickbar
          deleteAction={config.quickActions.includes('DELETE') ? deleteElement : undefined}
          duplicateAction={config.quickActions.includes('DUPLICATE') && !isDataTableEditableButtons ? duplicateElement : undefined}
          createAction={parentComponent?.type !== 'DataTableColumn' && config.quickActions.includes('CREATE') ? createElement : undefined}
          changeTypeAction={config.quickActions.includes('CHANGETYPE') ? changeElementType : undefined}
          createFromDataAction={
            parentComponent?.type !== 'DataTableColumn' &&
            parentComponent?.type !== 'Dialog' &&
            config.quickActions.includes('CREATEFROMDATA')
              ? data.cid
              : undefined
          }
          openComponentAction={
            config.quickActions.includes('OPENCOMPONENT') && data.type === 'Composite'
              ? () => openComponent((data.config as Composite).name)
              : undefined
          }
          extractIntoComponent={
            config.quickActions.includes('EXTRACTINTOCOMPONENT')
              ? { data, openDialog: showExtractDialog, setOpenDialog: onOpenExtractDialogChange }
              : undefined
          }
          createColumnAction={config.quickActions.includes('CREATECOLUMN') ? createColumn : undefined}
          createActionColumnAction={config.quickActions.includes('CREATEACTIONCOLUMN') ? createActionColumn : undefined}
          createActionColumnButtonAction={
            config.quickActions.includes('CREATEACTIONCOLUMNBUTTON') &&
            data.type === 'DataTableColumn' &&
            (data.config as DataTableColumn).asActionColumn
              ? createActionButton
              : undefined
          }
        />
      )}
    </Popover>
  );
};

export const ComponentBlockOverlay = ({ config, data }: DraggableProps) => {
  const elementConfig = addDefaults(data.type, data.config);
  return <div className='draggable dragging'>{config.render({ ...elementConfig, id: data.cid })}</div>;
};

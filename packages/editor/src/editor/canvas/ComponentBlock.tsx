import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { cn, evalDotState, Popover, PopoverAnchor, useReadonly } from '@axonivy/ui-components';
import { useDraggable } from '@dnd-kit/core';
import { addDefaults } from '../../components/component-factory';
import { useAppContext } from '../../context/AppContext';
import { ComponentBlockProvider, useComponentBlock } from '../../context/ComponentBlockContext';
import { useComponents } from '../../context/ComponentsContext';
import { useValidations } from '../../context/useValidation';
import type { ComponentConfig } from '../../types/config';
import './ComponentBlock.css';
import { dragData } from './drag-data';
import { DropZone, type DropZoneProps } from './DropZone';
import { isDataTableEditableButtons, isDialogButton } from './quickbar/component-quickaction-registry';
import { Quickbar } from './quickbar/Quickbar';
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
      <ComponentBlockProvider config={config} data={component}>
        <Draggable />
      </ComponentBlockProvider>
    </DropZone>
  );
};

export type DraggableProps = {
  config: ComponentConfig;
  data: Component | ComponentData;
};

const Draggable = () => {
  const { setUi } = useAppContext();
  const { data, config, onKeyDown } = useComponentBlock();
  const readonly = useReadonly();
  const { isDragging, attributes, listeners, setNodeRef } = useDraggable({
    disabled: readonly || isDataTableEditableButtons(data) || isDialogButton(data),
    id: data.cid,
    data: dragData(data)
  });
  const { selectedElement, setSelectedElement } = useAppContext();
  const isSelected = selectedElement === data.cid;
  const elementConfig = addDefaults(data.type, data.config);
  const validations = useValidations(data.cid);
  const clipboardProps = useCopyPaste(data);
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
      <Quickbar />
    </Popover>
  );
};

export const ComponentBlockOverlay = ({ config, data }: DraggableProps) => {
  const elementConfig = addDefaults(data.type, data.config);
  return <div className='draggable dragging'>{config.render({ ...elementConfig, id: data.cid })}</div>;
};

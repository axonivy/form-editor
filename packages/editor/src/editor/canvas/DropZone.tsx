import { useDndContext, useDroppable } from '@dnd-kit/core';
import './DropZone.css';
import type { ComponentProps } from 'react';
import { isDropZoneDisabled } from './drag-data';
import { cn } from '@axonivy/ui-components';
import type { ComponentType } from '@axonivy/form-editor-protocol';
import { useData } from '../../data/data';

export type DropZoneProps = ComponentProps<'div'> & {
  id: string;
  type?: ComponentType;
  preId?: string;
};

export const DropZone = ({ id, type, preId, className, children, style }: DropZoneProps) => {
  const dnd = useDndContext();
  const { data } = useData();

  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: isDropZoneDisabled(id, data.components, type, dnd.active, preId)
  });

  return (
    <div ref={setNodeRef} className={cn('drop-zone', isOver && 'is-drop-target', className)} style={style}>
      <div className='drop-zone-block' />
      {children}
    </div>
  );
};

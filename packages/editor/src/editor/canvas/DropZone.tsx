import type { ComponentType } from '@axonivy/form-editor-protocol';
import { cn } from '@axonivy/ui-components';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import type { ComponentProps } from 'react';
import { useData } from '../../data/data';
import { isDropZoneDisabled } from './drag-data';
import './DropZone.css';

export type DropZoneProps = ComponentProps<'div'> & {
  id: string;
  type?: ComponentType;
  preId?: string;
};

export const DropZone = ({ id, type, preId, className, children }: DropZoneProps) => {
  const dnd = useDndContext();
  const { data } = useData();

  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: isDropZoneDisabled(id, data.components, type, dnd.active, preId)
  });

  return (
    <div ref={setNodeRef} className={cn('drop-zone', isOver && 'is-drop-target', className)}>
      <div className='drop-zone-block' />
      {children}
    </div>
  );
};

import { cn, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { useAppContext } from '../../context/AppContext';
import { CANVAS_DROPZONE_ID, DELETE_DROPZONE_ID } from '../../data/data';
import './Canvas.css';
import { ComponentBlock } from './ComponentBlock';
import { EmptyBlock } from './EmptyBlock';
import { isDragData } from './drag-data';
import { useCopyPaste } from './useCopyPaste';

export const Canvas = () => {
  const { ui, data } = useAppContext();
  const clipboardProps = useCopyPaste();
  return (
    <div tabIndex={0} className='canvas' data-help-paddings={ui.helpPaddings} data-responsive-mode={ui.deviceMode} {...clipboardProps}>
      {data.components.map((component, index) => (
        <ComponentBlock key={component.cid} component={component} preId={data.components.at(index - 1)?.cid} />
      ))}
      <EmptyBlock id={CANVAS_DROPZONE_ID} components={data.components} />
      <DeleteDropZone />
    </div>
  );
};

const DeleteDropZone = () => {
  const { active } = useDndContext();
  const { isOver, setNodeRef } = useDroppable({ id: DELETE_DROPZONE_ID });
  if (!isDragData(active?.data.current)) {
    return null;
  }
  return (
    <div ref={setNodeRef} className={cn('delete-drop-zone', active && 'dnd-active', isOver && 'is-drop-target')}>
      <IvyIcon icon={IvyIcons.Trash} className='delete-icon' />
    </div>
  );
};

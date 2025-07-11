import type { ComponentType } from '@axonivy/form-editor-protocol';
import { cn, Flex, type PaletteItemConfig, type PaletteItemProps } from '@axonivy/ui-components';
import { useDraggable } from '@dnd-kit/core';
import { createComponent, type CreateData } from '../../components/component-factory';
import { useComponents } from '../../context/ComponentsContext';
import type { CreateComponentData } from '../../context/DndContext';
import './PaletteItem.css';

export type FormPaletteItemConfig = Omit<PaletteItemConfig, 'icon'> & {
  displayName: string;
  data?: CreateComponentData;
  directCreate?: (name: string) => void;
};

export const FormPaletteItem = ({
  displayName,
  name,
  description,
  classNames,
  data,
  directCreate
}: PaletteItemProps<FormPaletteItemConfig>) => {
  const { componentByName } = useComponents();
  const { attributes, listeners, setNodeRef } = useDraggable({ id: name, data });
  const componentName = data?.componentName ?? name;
  return (
    <button
      className={cn(classNames.paletteItem, 'ui-palette-item')}
      title={description}
      style={{ cursor: 'grab' }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => directCreate?.(name)}
    >
      <Flex direction='column' gap={1} alignItems='center'>
        <Flex className={cn(classNames.paletteItemIcon, 'ui-palette-item-icon')} justifyContent='center' alignItems='center'>
          {componentByName(componentName)?.icon}
        </Flex>
        <Flex justifyContent='center'>{displayName}</Flex>
      </Flex>
    </button>
  );
};

type PaletteItemOverlayProps = { type: ComponentType; createData?: CreateData };

export const PaletteItemOverlay = ({ type, createData }: PaletteItemOverlayProps) => {
  const { componentByName } = useComponents();
  const component = componentByName(type);
  return (
    <div className='draggable dragging' style={{ width: 400 }}>
      {/* eslint-disable-next-line i18next/no-literal-string */}
      {component.render({ id: 'overlay', ...createComponent(type, createData) })}
    </div>
  );
};

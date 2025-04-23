import { Flex, type PaletteItemConfig, type PaletteItemProps, cn } from '@axonivy/ui-components';
import { useDraggable } from '@dnd-kit/core';
import { useComponents } from '../../context/ComponentsContext';
import type { CreateComponentData } from '../../types/config';
import type { AutoCompleteWithString } from '../../types/types';
import type { ComponentType } from '@axonivy/form-editor-protocol';
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

type PaletteItemOverlayProps = { name: AutoCompleteWithString<ComponentType>; data?: CreateComponentData };

export const PaletteItemOverlay = ({ name, data }: PaletteItemOverlayProps) => {
  const { componentByName } = useComponents();
  const component = componentByName(data?.componentName ?? name);
  return (
    <div className='draggable dragging' style={{ width: 400 }}>
      {component.render(data ? component.create(data) : component.defaultProps)}
    </div>
  );
};
